/* eslint-disable no-restricted-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, User, Wallet} from 'lucide-react';
import CustomConnectButton from '@/components/connect-wallet/custom-connect-wallet';
import { Button } from '@/components/ui/button';
import logo from "../../public/img/newlogo.png";
import { usePathname } from 'next/navigation';
import Cookies from "js-cookie";

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Explore', href: '/explore' },
  { name: 'Tracker', href: '/search' },
  { name: 'Profile', href: '/profile' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [token, setToken] = useState(() => Cookies.get("token"));

  // Hanya tampilkan Profile jika ada token
  const filteredNavLinks = navLinks.filter(
    link => link.name !== 'Profile' || (link.name === 'Profile' && token)
  );

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setToken(Cookies.get("token"));
    }, 1000); // cek token setiap detik
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-900/90 backdrop-blur-md shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="relative w-20 h-10">
              <div className="absolute inset-0 " />
              <div className="absolute inset-0.5 flex items-center justify-center">
                <Image src={logo} alt='logo' width={100} height={100}/>
              </div>
            </div>
            <span className="text-2xl font-bold text-white">Clarylisk</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {filteredNavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors
                  ${pathname === link.href ? 'bg-white/10 text-white font-bold' : ''}
                  ${link.name === 'Explore' ? 'font-medium text-white' : ''}
                `}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <CustomConnectButton />
          </div>

          <div className="flex md:hidden items-center gap-2">
            <CustomConnectButton />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center p-2 rounded-lg text-white hover:bg-white/10"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-gray-900/95 backdrop-blur-lg md:hidden z-40 p-4">
          <div className="flex flex-col h-full">
            <nav className="flex flex-col space-y-2 mt-4">
              {filteredNavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors
                    ${pathname === link.href ? 'bg-white/10 text-white font-bold' : ''}
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}