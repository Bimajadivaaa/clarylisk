import { CREATOR_HUB_FACTORY, CREATOR_HUB_FACTORY_ABI } from "@/config/const";
import { useReadContract } from "wagmi";

export const useGetCreatorContract = (creatorAddress: string) => {
  const { data, isLoading, isError, error, refetch } = useReadContract({
    address: CREATOR_HUB_FACTORY,
    abi: CREATOR_HUB_FACTORY_ABI,
    functionName: "getCreatorContract",
    args: [creatorAddress],
  });

  return {
    contractAddress: data as string | undefined,
    isLoading,
    isError,
    error,
    refetch,
  };
};
