import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CREATOR_HUB_ABI } from "@/config/const";

export function useApproveSaweran(contractAddress: string) {
  const [hash, setHash] = useState<`0x${string}` | null>(null);

  const {
    writeContract,
    isPending: isWritePending,
    isSuccess: isWriteSuccess,
    isError: isWriteError,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isWaitLoading,
    isSuccess: isWaitSuccess,
    isError: isWaitError,
    error: waitError,
  } = useWaitForTransactionReceipt({
    hash: hash || undefined,
  });

  const approveSaweran = (saweranId: number | string) => {
    writeContract(
      {
        address: contractAddress as `0x${string}`,
        abi: CREATOR_HUB_ABI,
        functionName: "approveSaweran",
        args: [saweranId],
      },
      {
        onSuccess: (txHash) => setHash(txHash),
      }
    );
  };

  const reset = () => {
    setHash(null);
    resetWrite();
  };

  return {
    approveSaweran,
    isLoading: isWritePending || isWaitLoading,
    isSuccess: isWriteSuccess && isWaitSuccess,
    isError: isWriteError || isWaitError,
    error: writeError || waitError,
    hash,
    reset,
  };
} 