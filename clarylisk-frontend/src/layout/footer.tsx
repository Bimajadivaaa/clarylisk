'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-10 bg-black border-t border-white/10">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="text-2xl font-bold text-white mb-2">
              Clarylisk
            </div>
            <p className="text-white/50 text-sm">
              Transparent blockchain donations against online gambling
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <Link href="#" className="text-white/70 hover:text-white transition-colors">
              About
            </Link>
            <Link href="#" className="text-white/70 hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="#" className="text-white/70 hover:text-white transition-colors">
              For Creators
            </Link>
            <Link href="#" className="text-white/70 hover:text-white transition-colors">
              Documentation
            </Link>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <div className="text-white/50 text-sm mb-4 md:mb-0">
            © 2025 Clarylisk. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-white/70 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-white/70 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}