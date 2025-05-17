import { useAccount, useConnect, useDisconnect } from "wagmi";

export function useWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending: isConnectPending } = useConnect();
  const { disconnect, isPending: isDisconnectPending } = useDisconnect();

  return {
    address,
    isConnected,
    connect,
    disconnect,
    connectors,
    isPending: isConnectPending || isDisconnectPending,
  };
}