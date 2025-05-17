'use client';

import { ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
export default function Cta() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20" />
      </div>
      
      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-gray-900 to-black border-0 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/5 opacity-10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2" />
            
            <CardContent className="p-12 relative">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Join the Movement Against Online Gambling
                </h2>
                <p className="text-lg text-white/70 max-w-2xl mx-auto">
                  Be part of a transparent, blockchain-powered solution that holds platforms accountable and creates measurable impact.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                {/* <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg w-full sm:w-auto"
                >
                  <span>Connect Wallet</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button> */}
                <Link href="https://bimajdiva.gitbook.io/clarylisk" target='_blank'>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto hover:text-white"
                >
                  <span className='text-black hover:text-white'>View Documentation</span>
                  <ExternalLink className="ml-2 w-4 h-4 text-black hover:text-white" />
                </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}