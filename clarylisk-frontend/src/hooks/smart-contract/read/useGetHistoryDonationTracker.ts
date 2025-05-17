import { CREATOR_HUB_ABI } from "@/config/const";
import { useReadContract } from "wagmi";

export function useCreatorDonationHistory(contractAddress: string) {
  const { data, isLoading, isError, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: CREATOR_HUB_ABI,
    functionName: "getHistorySaweran",
    args: [],
  });

  const donations = Array.isArray(data) ? data : [];

  const summary = donations.reduce(
    (acc, d) => {
      if (d.approved) acc.accepted += Number(d.value);
      else if (d.discarded) acc.burned += Number(d.value);
      else acc.pending += Number(d.value);
      return acc;
    },
    { accepted: 0, burned: 0, pending: 0 },
  );

  return {
    donations,
    summary,
    isLoading,
    isError,
    error,
    refetch,
  };
}
