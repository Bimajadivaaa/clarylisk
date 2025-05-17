import { CREATOR_HUB_ABI } from "@/config/const";
import { useReadContract } from "wagmi";

export function useGetHistorySaweran(contractAddress: string) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: CREATOR_HUB_ABI,
    functionName: "getHistorySaweran",
    args: [],
    query: {
      enabled: !!contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  const donations = Array.isArray(data) ? data : [];

  return {
    donations,
    isLoading,
    isError,
    error,
    refetch,
  };
} 