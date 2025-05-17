'use client';

import { Flame, BarChart3, Shield, Globe, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Stats() {
  return (
    <main className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-blue-900/20" />
        {/* {Array.from({ length: 20 }).map((_, i) => (
          // <div 
          //   key={i}
          //   className="absolute rounded-full bg-blue-500/30"
          //   style={{
          //     width: `${Math.random() * 300 + 50}px`,
          //     height: `${Math.random() * 300 + 50}px`,
          //     top: `${Math.random() * 100}%`,
          //     left: `${Math.random() * 100}%`,
          //     filter: 'blur(50px)',
          //     opacity: Math.random() * 0.5 + 0.1,
          //     animation: `float ${Math.random() * 10 + 20}s infinite linear`,
          //   }}
          // />
        ))} */}
      </div>
      
      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Real-Time Blockchain Impact
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            See the transparent, verifiable difference we are making together in combating online gambling.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Total IDRX Burned',
              value: '9,847',
              unit: 'IDRX',
              change: '+14.5%',
              icon: <Flame className="w-6 h-6 text-red-500" />
            },
            {
              title: 'Donations Tracked',
              value: '5,243',
              unit: '',
              change: '+23.1%',
              icon: <BarChart3 className="w-6 h-6 text-blue-500" />
            },
            {
              title: 'Verified Creators',
              value: '327',
              unit: '',
              change: '+8.2%',
              icon: <Shield className="w-6 h-6 text-green-500" />
            },
            {
              title: 'Platform Partners',
              value: '18',
              unit: '',
              change: '+2',
              icon: <Globe className="w-6 h-6 text-purple-500" />
            }
          ].map((stat, index) => (
            <Card key={index} className="bg-gray-800/50 border border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white/70 text-sm font-normal">
                    {stat.title}
                  </CardTitle>
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2">
                  <div className="text-3xl font-bold text-white">
                    {stat.value}
                  </div>
                  {stat.unit && (
                    <div className="text-lg text-white/70 mb-1">
                      {stat.unit}
                    </div>
                  )}
                </div>
                <div className="text-green-400 text-sm mt-2">
                  {stat.change} this month
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}