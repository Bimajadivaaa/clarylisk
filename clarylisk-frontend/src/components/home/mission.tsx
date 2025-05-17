'use client';

import { Flame, BarChart3, Shield } from 'lucide-react';

export default function Mission() {
  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Transforming Gambling Donations Into Positive Change
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Clarylisk uses blockchain technology to transparently track and burn donations from online gambling platforms, ensuring accountability and measurable impact.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <Flame className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white mb-2">Burn Mechanism</h3>
                  <p className="text-white/70">
                    Donations from gambling platforms are permanently removed from circulation, reducing harmful industry capital.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <BarChart3 className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white mb-2">Transparent Tracking</h3>
                  <p className="text-white/70">
                    Every donation is recorded on the blockchain, providing complete visibility into the impact of your contributions.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Shield className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white mb-2">Creator Accountability</h3>
                  <p className="text-white/70">
                    Content creators can prove their commitment to responsible practices through verified blockchain donations.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 relative">
            <div className="relative aspect-square max-w-md mx-auto">
              {/* 3D-like blockchain visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute w-full h-full border-2 border-blue-500/30 rounded-xl"
                      style={{ 
                        transform: `scale(${1 - i * 0.15}) translateZ(${i * 20}px) rotate(${i * 5}deg)`,
                        opacity: 1 - i * 0.15,
                        backgroundColor: `rgba(59, 130, 246, ${0.05 - i * 0.01})`,
                      }}
                    />
                  ))}
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-8 rounded-xl bg-blue-900/20 backdrop-blur-lg border border-blue-500/30 text-center shadow-lg">
                      <Flame className="w-16 h-16 mx-auto text-red-500 mb-4" />
                      <div className="text-2xl font-bold text-white">Burning</div>
                      <div className="flex items-center justify-center gap-2 mt-2 text-blue-400">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span>Live on Blockchain</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}