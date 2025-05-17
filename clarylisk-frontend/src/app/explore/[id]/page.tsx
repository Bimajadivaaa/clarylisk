"use client";

import { useParams, useRouter } from "next/navigation";
import { useCreatorById } from "@/hooks/API/useGetCreatorById";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Copy,
  Check,
  User,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetCreatorContract } from "@/hooks/smart-contract/read/useGetCreatorContract";
import { useDonate } from "@/hooks/smart-contract/write/useDonate";
import { Input } from "@/components/ui/input";
import IDRXLogo from "../../../../public/img/IDRXLogo.jpg";

export default function CreatorProfilePage() {
  const params = useParams();
  const creatorId = params?.id as string;
  const { creator, isLoading, error } = useCreatorById(creatorId);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const walletAddress = creator?.wallet[0]?.walletAdress || "-";

  const truncateAddress = (address: string) => {
    if (address === "-" || address.length < 10) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const {
    contractAddress,
    isLoading: isContractLoading,
    isError: isContractError,
    error: contractError,
    refetch: refetchContract,
  } = useGetCreatorContract(walletAddress);

  const {
    donate,
    isLoading: isDonateLoading,
    isSuccess: isDonateSuccess,
    isError: isDonateError,
    error: donateError,
    donateHash,
    currentStep,
  } = useDonate();
  const [donateAmount, setDonateAmount] = useState("");
  const [donateNote, setDonateNote] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-10 flex items-center justify-center px-2">
        <Card className="w-full max-w-xl sm:max-w-2xl mx-auto bg-black/60 border border-gray-800 backdrop-blur-sm">
          <CardHeader className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Skeleton className="h-24 w-24 rounded-full bg-gray-800/50" />
              <Skeleton className="absolute -bottom-1 -right-1 h-6 w-16 rounded-full bg-gray-800/50" />
            </div>
            <div className="space-y-2 text-center">
              <Skeleton className="h-8 w-40 mx-auto bg-gray-800/50" />
              <Skeleton className="h-4 w-20 mx-auto bg-gray-800/50" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 bg-gray-800/50" />
              <div className="flex items-center justify-between bg-gray-900/50 rounded-md p-3 border border-gray-800">
                <Skeleton className="h-4 w-40 bg-gray-800/50" />
                <Skeleton className="h-8 w-8 rounded-full bg-gray-800/50" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-32 bg-gray-800/50" />
              <div className="space-y-2 bg-gray-900/50 rounded-md p-3 border border-gray-800">
                <Skeleton className="h-4 w-full bg-gray-800/50" />
                <Skeleton className="h-4 w-3/4 bg-gray-800/50" />
                <Skeleton className="h-4 w-1/2 bg-gray-800/50" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-32 bg-gray-800/50" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-8 rounded-full bg-gray-800/50" />
                <Skeleton className="h-8 w-8 rounded-full bg-gray-800/50" />
                <Skeleton className="h-8 w-8 rounded-full bg-gray-800/50" />
                <Skeleton className="h-8 w-8 rounded-full bg-gray-800/50" />
              </div>
            </div>

            <Separator className="bg-gray-800" />

            <div className="flex justify-between pt-2">
              <Skeleton className="h-8 w-20 bg-gray-800/50" />
              <Skeleton className="h-8 w-32 bg-gray-800/50" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-6 flex items-center justify-center">
        <Card className="w-full max-w-xl bg-black/60 border border-gray-800 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-red-500 text-xl">
              Error Loading Profile
            </CardTitle>
            <CardDescription className="text-gray-400">{error}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-black flex items-center justify-center ">
        <Card className="bg-black/60 border border-gray-800 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-gray-300 text-xl">
              No Creator Found
            </CardTitle>
            <CardDescription className="text-gray-400">
              The creator profile you're looking for could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const imgSrc = creator.image[0]?.image;
  const isIpfs = imgSrc && imgSrc.startsWith("https://ipfs.io");
  const isBase64 = imgSrc && imgSrc.startsWith("data:image");
  const isHttp = imgSrc && /^https?:\/\//.test(imgSrc);
  const showImage = isIpfs || isBase64 || isHttp;

  return (
    <main className="bg-gradient-to-b from-gray-900 to-black pt-24 flex items-center justify-center px-2 pb-10">
      <Card className="w-full max-w-xl sm:max-w-2xl mx-auto bg-black/60 border border-gray-800 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.07)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300">
        <CardHeader className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Image
              src={showImage ? imgSrc : "/default-avatar.png"}
              alt={creator.username}
              width={96}
              height={96}
              className="rounded-full border-2 border-primary/50 shadow-glow object-cover"
            />
            <Badge
              className="absolute -bottom-1 -right-1 px-2 py-1 bg-primary text-primary-foreground"
              variant="default"
            >
              {creator.role || "Creator"}
            </Badge>
          </div>

          <div className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-white">
              {creator.username}
            </CardTitle>
            <CardDescription className="text-gray-400">
              Member since {new Date().getFullYear()}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-300">
                Wallet Address
              </h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-primary"
                      onClick={() => copyToClipboard(walletAddress)}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy wallet address</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="bg-gray-900/50 rounded-md p-3 border border-gray-800 text-gray-400 text-sm font-mono break-all">
              {truncateAddress(walletAddress)}
            </div>
            <div className="mt-2">
              <span className="text-xs text-gray-400">
                Creator Contract Address:
              </span>
              <br />
              {isContractLoading ? (
                <span className="text-blue-400 text-xs">Loading...</span>
              ) : isContractError ? (
                <span className="text-red-400 text-xs">
                  {contractError?.message || "Failed to fetch contract."}
                </span>
              ) : contractAddress &&
                contractAddress !==
                  "0x0000000000000000000000000000000000000000" ? (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-green-400 text-xs font-mono">
                    {truncateAddress(contractAddress)}
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-400 hover:text-primary"
                          onClick={() => copyToClipboard(contractAddress)}
                        >
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy contract address</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ) : (
                <span className="text-yellow-400 text-xs">
                  No contract found
                </span>
              )}
            </div>
            {contractAddress &&
              contractAddress !==
                "0x0000000000000000000000000000000000000000" && (
                <div className="mt-4 p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-gray-300">
                      Donate $IDRX{" "}
                      <Image
                        src={IDRXLogo}
                        alt="IDRX"
                        width={15}
                        height={15}
                        className="inline-block rounded-full mb-1"
                      />
                    </label>
                    <Input
                      type="number"
                      min="101"
                      step="any"
                      placeholder="Amount (min. 101 IDRX)"
                      value={donateAmount}
                      onChange={(e) => setDonateAmount(e.target.value)}
                      className={`bg-gray-800/50 border-gray-700 text-white ${donateAmount && Number(donateAmount) < 101 ? 'border-red-500' : ''}`}
                    />
                    {donateAmount && Number(donateAmount) < 101 && (
                      <p className="text-red-400 text-xs mt-1">
                        Minimum donation amount is 101 IDRX
                      </p>
                    )}
                    <Input
                      type="text"
                      placeholder="Note (optional)"
                      value={donateNote}
                      onChange={(e) => setDonateNote(e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white"
                    />
                    <Button
                      onClick={() => {
                        const amountInEther = donateAmount.toString();
                        donate(contractAddress, amountInEther, donateNote);
                        console.log("donate amount", amountInEther);
                      }}
                      disabled={
                        isDonateLoading ||
                        !donateAmount ||
                        Number(donateAmount) < 101
                      }
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white mt-2"
                    >
                      {isDonateLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          Processing...
                        </>
                      ) : (
                        "Donate"
                      )}
                    </Button>
                    {currentStep === "approving" && (
                      <div className="text-blue-400 text-xs flex items-center gap-2">
                        <Loader2 className="animate-spin h-4 w-4" /> Approving
                        IDRX...
                      </div>
                    )}
                    {currentStep === "donating" && (
                      <div className="text-blue-400 text-xs flex items-center gap-2">
                        <Loader2 className="animate-spin h-4 w-4" /> Sending
                        donation...
                      </div>
                    )}
                    {isDonateSuccess && (
                      <div className="text-green-500 text-xs">
                        Donation successful!
                        <br />
                        {/* Tx: {donateHash} */}
                        <br />
                        <a href={`https://blockscout.lisk.com/tx/${donateHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
                          View on Explorer
                        </a>
                      </div>
                    )}
                    {isDonateError && (
                      <div className="text-red-500 text-xs">
                        {donateError?.message || "Donation failed."}
                      </div>
                    )}
                  </div>
                </div>
              )}
          </div>

          {creator.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-300">About</h3>
              <ScrollArea className="max-h-32 rounded-md bg-gray-900/50 border border-gray-800 p-3">
                <p className="text-gray-400 text-sm">{creator.description}</p>
              </ScrollArea>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-300">Connect</h3>
            <div className="flex flex-wrap gap-2">
              {creator.medsos[0]?.facebook && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-gray-900/50 border-gray-800 text-blue-500 hover:text-blue-400 hover:bg-gray-800/50"
                        onClick={() =>
                          window.open(
                            `https://facebook.com/${creator.medsos[0].facebook}`,
                            "_blank",
                          )
                        }
                      >
                        <Facebook size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{creator.medsos[0].facebook}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {creator.medsos[0]?.instagram && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-gray-900/50 border-gray-800 text-pink-500 hover:text-pink-400 hover:bg-gray-800/50"
                        onClick={() =>
                          window.open(
                            `https://instagram.com/${creator.medsos[0].instagram}`,
                            "_blank",
                          )
                        }
                      >
                        <Instagram size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{creator.medsos[0].instagram}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {creator.medsos[0]?.twitter && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-gray-900/50 border-gray-800 text-blue-400 hover:text-blue-300 hover:bg-gray-800/50"
                        onClick={() =>
                          window.open(
                            `https://twitter.com/${creator.medsos[0].twitter}`,
                            "_blank",
                          )
                        }
                      >
                        <Twitter size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{creator.medsos[0].twitter}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {creator.medsos[0]?.youtube && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-gray-900/50 border-gray-800 text-red-500 hover:text-red-400 hover:bg-gray-800/50"
                        onClick={() =>
                          window.open(
                            `https://youtube.com/${creator.medsos[0].youtube}`,
                            "_blank",
                          )
                        }
                      >
                        <Youtube size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{creator.medsos[0].youtube}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {!creator.medsos[0]?.facebook &&
                !creator.medsos[0]?.instagram &&
                !creator.medsos[0]?.twitter &&
                !creator.medsos[0]?.youtube && (
                  <p className="text-gray-500 text-sm italic">
                    No social media profiles available
                  </p>
                )}
            </div>
          </div>

          <Separator className="bg-gray-800" />

          <div className="flex justify-between pb-10 gap-4">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-400 bg-gray-900/50 border-gray-800 hover:bg-gray-800/50"
              onClick={() => window.history.back()}
            >
              Back
            </Button>

            <Button
              variant="default"
              size="sm"
              className="bg-primary hover:bg-primary/80"
              onClick={() => {
                if (
                  contractAddress &&
                  contractAddress !==
                    "0x0000000000000000000000000000000000000000"
                ) {
                  router.push(`/search?wallet=${contractAddress}`);
                }
              }}
            >
              <User size={16} className="mr-1" />
              Track Donation History
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
