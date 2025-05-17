import { useReadContract } from "wagmi";
import { CREATOR_HUB_ABI } from "@/config/const";

export function useGetContractBalance(contractAddress: string) {
  const { data, isLoading, isError, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: CREATOR_HUB_ABI,
    functionName: "getContractBalances",
    args: [],
  });

  let approved = 0, pending = 0, discard = 0;
  if (Array.isArray(data) && data.length === 3) {
    approved = Number(data[0]);
    pending = Number(data[1]);
    discard = Number(data[2]);
  }

  return {
    approved,
    pending,
    discard,
    isLoading,
    isError,
    error,
    refetch,
  };
}
