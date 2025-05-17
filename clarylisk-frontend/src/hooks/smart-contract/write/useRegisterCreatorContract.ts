import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CREATOR_HUB_FACTORY, CREATOR_HUB_FACTORY_ABI } from "@/config/const";

interface RegisterCreatorResult {
  isLoading: boolean;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  hash: `0x${string}` | null;
  registerCreator: () => void;
  reset: () => void;
}

export const useRegisterCreatorContract = (): RegisterCreatorResult => {
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

  const registerCreator = () => {
    writeContract(
      {
        address: CREATOR_HUB_FACTORY,
        abi: CREATOR_HUB_FACTORY_ABI,
        functionName: "registerCreator",
      },
      {
        onSuccess: (hash) => {
          setHash(hash);
        },
      },
    );
  };

  const reset = () => {
    setHash(null);
    resetWrite();
  };

  const isLoading = isWritePending || isWaitLoading;
  const isSuccess = isWriteSuccess && isWaitSuccess;
  const isError = isWriteError || isWaitError;
  const error = writeError || waitError;

  return {
    isLoading,
    isPending: isWritePending,
    isSuccess,
    isError,
    error,
    hash,
    registerCreator,
    reset,
  };
};

export default useRegisterCreatorContract;
