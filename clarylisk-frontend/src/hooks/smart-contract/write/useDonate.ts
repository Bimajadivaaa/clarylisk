import { useState, useEffect } from 'react';
import { 
  useWriteContract, 
  useWaitForTransactionReceipt,
} from 'wagmi';
import { IDRX_CONTRACT, IDRX_ABI, CREATOR_HUB_ABI } from "@/config/const";
import { parseEther } from 'viem';

interface DonateResult {
  isLoading: boolean;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  approveHash: `0x${string}` | null;
  donateHash: `0x${string}` | null;
  approveReceipt: any | null;
  donateReceipt: any | null;
  donate: (creatorAddress: string, amount: string, note: string) => void;
  reset: () => void;
  currentStep: 'idle' | 'approving' | 'approved' | 'donating' | 'completed' | 'error';
}

export const useDonate = (): DonateResult => {
  const [approveHash, setApproveHash] = useState<`0x${string}` | null>(null);
  const [donateHash, setDonateHash] = useState<`0x${string}` | null>(null);
  const [approvedAmount, setApprovedAmount] = useState<string | null>(null);
  const [targetCreator, setTargetCreator] = useState<string | null>(null);
  const [donationNote, setDonationNote] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'idle' | 'approving' | 'approved' | 'donating' | 'completed' | 'error'>('idle');
  
  const { 
    writeContract: writeApprove, 
    isPending: isApprovePending, 
    isSuccess: isApproveSuccess,
    isError: isApproveError,
    error: approveError,
    reset: resetApprove
  } = useWriteContract();
  
  const { 
    writeContract: writeDonate, 
    isPending: isDonatingPending, 
    isSuccess: isDonatingSuccess,
    isError: isDonatingError,
    error: donatingError,
    reset: resetDonate
  } = useWriteContract();
  
  const { 
    data: approveReceipt, 
    isLoading: isApproveLoading,
    isSuccess: isApproveReceiptSuccess,
    isError: isApproveReceiptError,
  } = useWaitForTransactionReceipt({
    hash: approveHash || undefined,
  });
  
  const { 
    data: donateReceipt, 
    isLoading: isDonateLoading,
    isSuccess: isDonateReceiptSuccess,
    isError: isDonateReceiptError,
  } = useWaitForTransactionReceipt({
    hash: donateHash || undefined,
  });
  
  useEffect(() => {
    if (isApproveReceiptSuccess && currentStep === 'approving') {
      setCurrentStep('approved');
    }
    
    if (isDonateReceiptSuccess && currentStep === 'donating') {
      setCurrentStep('completed');
    }
    
    if ((isApproveReceiptError && currentStep === 'approving') || 
        (isDonateReceiptError && currentStep === 'donating')) {
      setCurrentStep('error');
    }
  }, [
    isApproveReceiptSuccess, 
    isDonateReceiptSuccess, 
    isApproveReceiptError, 
    isDonateReceiptError, 
    currentStep
  ]);
  
  useEffect(() => {
    const executeDonation = async () => {
      if (currentStep === 'approved' && approvedAmount && targetCreator && donationNote) {
        setCurrentStep('donating');
        
        writeDonate(
          {
            address: targetCreator as `0x${string}`,
            abi: CREATOR_HUB_ABI,
            functionName: 'sawer',
            args: [approvedAmount, donationNote],
          },
          {
            onSuccess: (hash) => {
              setDonateHash(hash);
            },
            onError: () => {
              setCurrentStep('error');
            }
          }
        );
      }
    };
    
    executeDonation();
  }, [currentStep, approvedAmount, targetCreator, donationNote, writeDonate]);
  
  const donate = (creatorAddress: string, amount: string, note: string) => {
    resetApprove();
    resetDonate();
    setApproveHash(null);
    setDonateHash(null);
    setCurrentStep('approving');
    
    try {
      const amountInWei = amount.toString();
      
      setApprovedAmount(amountInWei);
      setTargetCreator(creatorAddress);
      setDonationNote(note);
      
      writeApprove(
        {
          address: IDRX_CONTRACT,
          abi: IDRX_ABI,
          functionName: 'approve',
          args: [creatorAddress, amountInWei],
        },
        {
          onSuccess: (hash) => {
            setApproveHash(hash);
          },
          onError: (error) => {
            console.error("Approval error:", error);
            setCurrentStep('error');
          }
        }
      );
    } catch (error) {
      console.error("Error processing donation:", error);
      setCurrentStep('error');
    }
  };
  
  const reset = () => {
    resetApprove();
    resetDonate();
    setApproveHash(null);
    setDonateHash(null);
    setApprovedAmount(null);
    setTargetCreator(null);
    setDonationNote(null);
    setCurrentStep('idle');
  };
  
  const isLoading = isApprovePending || isApproveLoading || isDonatingPending || isDonateLoading;
  const isPending = isApprovePending || isDonatingPending;
  const isSuccess = currentStep === 'completed';
  const isError = isApproveError || isApproveReceiptError || isDonatingError || isDonateReceiptError;
  const error = approveError || donatingError;
  
  return {
    isLoading,
    isPending,
    isSuccess,
    isError,
    error,
    approveHash,
    donateHash,
    approveReceipt,
    donateReceipt,
    donate,
    reset,
    currentStep
  };
};

export default useDonate;