'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Lock, ArrowRight, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/hooks/API/useLogin';
import { useWallet } from '@/hooks/useWallet';
import { ConnectButton } from '@xellar/kit';

export default function LoginPage() {
  const router = useRouter();
  const { address } = useWallet();
  const {
    credentials,
    isLoading,
    error,
    handleChange,
    login,
  } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login();
    if (success) {
      router.push('/explore');
    }
  };

  // Show wallet connection prompt if wallet is not connected
  if (!address) {
    return (
      <main className="min-h-screen bg-black py-8 px-4 flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 -right-40 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0,rgba(0,0,0,0)_70%)]" />
          
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
        </div>

        <div className="max-w-md w-full mx-auto relative z-10">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600">
                Connect Wallet
              </span>
            </h1>
            <p className="text-gray-400 text-sm">
              Please connect your wallet to continue with the login process
            </p>
          </div>

          <Card className="bg-gray-900/70 border border-gray-800 shadow-xl overflow-hidden">
            <CardHeader className="border-b border-gray-800 bg-gray-900/80 py-4">
              <CardTitle className="text-white text-lg">Wallet Required</CardTitle>
              <CardDescription className="text-gray-400 text-sm">
                Your wallet connection is required to access your account
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 pb-4 flex flex-col items-center space-y-4">
              <div className="text-center space-y-2">
                <Wallet className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="text-gray-400 text-sm">
                  No wallet detected. Please connect your wallet to proceed with login.
                </p>
              </div>

              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <Button
                    onClick={openConnectModal}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-10"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </Button>
                )}
              </ConnectButton.Custom>
            </CardContent>

            <CardFooter className="border-t border-gray-800 bg-gray-900/80 pt-4 pb-5 flex justify-center">
              <Link href="/">
                <Button 
                  variant="outline" 
                  className="bg-gray-900/50 border border-gray-800 text-gray-300 hover:bg-gray-800/50 text-sm px-4 py-2 h-9"
                >
                  Back to Home
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black py-8 px-4 flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0,rgba(0,0,0,0)_70%)]" />
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      </div>

      <div className="max-w-md w-full mx-auto relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600">
              Welcome Back
            </span>
          </h1>
          <p className="text-gray-400 text-sm">
            Login to your Clarylisk account to manage your creator profile<br />and track donations
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-md text-white">
            {error}
          </div>
        )}

        <Card className="bg-gray-900/70 border border-gray-800 shadow-xl overflow-hidden">
          <CardHeader className="border-b border-gray-800 bg-gray-900/80 py-4">
            <CardTitle className="text-white text-lg">Login</CardTitle>
            <CardDescription className="text-gray-400 text-sm">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="pt-6 pb-4 space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="walletAddress" className="text-white text-sm">
                  Wallet Address
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                  <Input 
                    id="walletAddress" 
                    value={address}
                    disabled
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white h-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-white text-sm">
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white h-10"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="show-password" className="border-gray-600 data-[state=checked]:bg-blue-600" checked={showPassword} onCheckedChange={checked => setShowPassword(checked === true)} />
                <Label htmlFor="show-password" className="text-gray-300 text-xs font-normal">
                  Show password
                </Label>
              </div>
            </CardContent>

            <CardFooter className="border-t border-gray-800 bg-gray-900/80 pt-4 pb-5 flex flex-col">
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-10 mb-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span>Login</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
              
              <div className="text-center text-gray-400 text-xs">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-blue-400 hover:text-blue-300">
                  Register as Creator
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/">
            <Button 
              variant="outline" 
              className="bg-gray-900/50 border border-gray-800 text-gray-300 hover:bg-gray-800/50 text-sm px-4 py-2 h-9"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}