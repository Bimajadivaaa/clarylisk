/* eslint-disable no-restricted-imports */
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, Flame, Copy, Check } from 'lucide-react';
import { Creator } from '@/hooks/API/useGetCreator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import SocialLinks from './social-links';
import image from '../../../public/1.png';
import { useGetCreatorContract } from '@/hooks/smart-contract/read/useGetCreatorContract';
import { useGetHistorySaweran } from '@/hooks/smart-contract/read/useGetHistorySaweran';
import { useState } from 'react';
import IDRXLogo from "../../../public/img/IDRXLogo.jpg";

interface CreatorCardProps {
  creator: Creator;
}

function formatShortNumber(num: number | null | undefined) {
  if (num === null || num === undefined) return "-";
  num = Number(num);
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(num % 1_000_000_000 === 0 ? 0 : 1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1) + "k";
  return num.toLocaleString();
}

export default function CreatorCard({ creator }: CreatorCardProps) {
  const imgSrc = creator.image[0]?.image;
  const isIpfs = imgSrc && imgSrc.startsWith('https://ipfs.io');
  const isBase64 = imgSrc && imgSrc.startsWith('data:image');
  const showImage = isIpfs || isBase64;

  // Ambil contract address dari wallet creator
  const { contractAddress } = useGetCreatorContract(creator.wallet[0]?.walletAdress || '');
  // Ambil donasi dari contract
  const { donations, isLoading } = useGetHistorySaweran(contractAddress || '');

  // Hitung total approved dan burned
  const totalApproved = donations && donations.length > 0
    ? donations.filter(d => d.approved).reduce((sum, d) => sum + Number(d.value), 0)
    : 0;
  const totalBurned = donations && donations.length > 0
    ? donations.filter(d => d.discarded).reduce((sum, d) => sum + Number(d.value), 0)
    : 0;

  const [copied, setCopied] = useState(false);

  const shortAddress = (addr: string) =>
    addr ? `${addr.substring(0, 6)}...${addr.slice(-6)}` : '';

  const handleCopy = () => {
    if (contractAddress) {
      navigator.clipboard.writeText(contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <Card className="bg-gray-900/70 border border-gray-800 overflow-hidden hover:border-purple-500/50 transition-colors group">
      <div className="relative h-40 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={showImage ? imgSrc : image}
            alt={creator.username}
            width={100}
            height={100}
            className="rounded-full border-2 border-white/20"
          />
        </div>
      </div>
      
      <CardContent className="pt-4">
        <div className="text-center mb-3">
          <h3 className="text-white font-bold text-lg">{creator.username}</h3>
          <p className="text-gray-400 text-sm line-clamp-2 h-10">{creator.description}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gray-800/50 rounded-md p-2 text-center">
            <p className="text-white font-medium text-sm">{isLoading ? '...' : formatShortNumber(totalApproved)} IDRX <Image src={IDRXLogo} alt="IDRX" width={15} height={15} className="inline-block rounded-full mb-1" /></p>
            <div className="flex items-center justify-center gap-x-1 mt-1">
              <ArrowDown className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-xs">Received</span>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-md p-2 text-center">
            <p className="text-white font-medium text-sm">{isLoading ? '...' : formatShortNumber(totalBurned)} IDRX <Image src={IDRXLogo} alt="IDRX" width={15} height={15} className="inline-block rounded-full mb-1" /></p>
            <div className="flex items-center justify-center gap-x-1 mt-1">
              <Flame className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-xs">Burned</span>
            </div>
          </div>
        </div>
        {/* Creator contract address */}
        <div className="flex flex-col items-center justify-center text-[11px] text-gray-400 break-all text-center mb-2">
          {contractAddress && contractAddress !== "0x0000000000000000000000000000000000000000" ? (
            <div className="flex items-center gap-2">
              <span>Creator Address:</span>
              <span className="font-mono">{shortAddress(contractAddress)}</span>
              <button
                onClick={handleCopy}
                className="ml-1 p-1 rounded hover:bg-gray-800 transition"
                title="Copy address"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          ) : (
            <div className="text-red-400">Creator contract not found</div>
          )}
        </div>
        
        {/* <div className="flex justify-center gap-2">
          <SocialLinks socialLinks={creator.medsos[0] || {}} />
        </div> */}
      </CardContent>
      
      <CardFooter className="border-t border-gray-800 bg-gray-900/30 pt-3 pb-3">
        <Button 
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          asChild
        >
          <Link href={`/explore/${creator.idUser}`}>
            <span className="flex items-center justify-center">
              View Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}