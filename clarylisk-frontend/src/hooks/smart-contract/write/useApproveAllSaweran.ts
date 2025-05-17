import { useWriteContract } from "wagmi";
import { CREATOR_HUB_ABI } from "@/config/const";
import { useState } from "react";

export const useApproveAllSaweran = (contractAddress: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<any>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { writeContractAsync } = useWriteContract();

  const approveAllSaweran = async (startIdx: number, batchSize: number) => {
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);
    setError(null);
    setTxHash(null);
    try {
      const hash = await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: CREATOR_HUB_ABI,
        functionName: "acceptAllSaweransBatched",
        args: [startIdx, batchSize],
      });
      setTxHash(hash);
      setIsSuccess(true);
    } catch (err) {
      setIsError(true);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    approveAllSaweran,
    isLoading,
    isSuccess,
    isError,
    error,
    txHash,
  };
};