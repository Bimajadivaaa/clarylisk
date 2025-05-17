"use client";

import { ConnectButton } from "@xellar/kit";
import { Button } from "@/components/ui/button";
import liskLogo from "../../../public/img/liskLogo.png"
import Image from "next/image";
import { useLogout } from "@/hooks/API/useLogout";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

export default function CustomConnectButton() {
  const { logout } = useLogout();
  const pathname = usePathname();
  const isLoginPage = pathname === '/login' || pathname === '/register' || pathname === '/';

  return (
    <ConnectButton.Custom>
      {({
        isConnected,
        account,
        chain,
        openConnectModal,
        openChainModal,
        openProfileModal,
      }) => {
        if (!isConnected) {
          return (
            <Button 
              onClick={openConnectModal} 
              type="button"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
            >
              Connect Wallet
            </Button>
          );
        }

        return (
          <div className="flex items-center gap-3">
            <Button
              onClick={openChainModal}
              type="button"
              variant="outline"
              className="bg-white text-black hover:bg-white/80 hover:text-black"
            >
              <Image src={liskLogo} alt="Lisk Logo" width={20} height={20} />
              {chain?.name}
            </Button>
            <Button 
              onClick={openProfileModal} 
              type="button"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {account?.address.slice(0, 6)}...
              {account?.address.slice(-4)}
            </Button>
            {/* {!isLoginPage && (
              <Button
                onClick={logout}
                type="button"
                variant="outline"
                className="bg-red-600 text-white hover:bg-red-700 hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )} */}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}