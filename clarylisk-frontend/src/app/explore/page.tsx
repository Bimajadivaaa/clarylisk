'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CreatorGridView from '@/components/explore/creator-grid-view';
import ExploreFilters from '@/components/explore/explore-filter';
import ExploreHeader from '@/components/explore/explore-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetCreator } from '@/hooks/API/useGetCreator';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import IDRXLogo from "../../../public/img/IDRXLogo.jpg";

export default function ExplorePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('popular');
  const { creators, total, isLoading, error, refreshCreators } = useGetCreator();
  const [filteredCreators, setFilteredCreators] = useState(creators);

  useEffect(() => {
    let result = [...creators];
    
    if (searchTerm) {
      result = result.filter(creator => 
        creator.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (sort === 'popular') {
      result = result.sort((a, b) => b.idUser - a.idUser);
    } else if (sort === 'newest') {
      result = result.sort((a, b) => b.idUser - a.idUser);
    }
    
    setFilteredCreators(result);
  }, [searchTerm, sort, creators]);

  useEffect(() => {
    if (error) {
      console.error('Error fetching creators:', error);
      if (error.includes('No authentication token found')) {
        router.push('/login');
      }
    }
  }, [error, router]);

  return (
    <main className="min-h-screen bg-black pb-20 pt-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0,rgba(0,0,0,0)_70%)]" />
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <ExploreHeader />
        
        <ExploreFilters 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          sort={sort}
          setSort={setSort}
        />

        <Tabs defaultValue="grid" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <div className="text-white text-sm">
              Find your favorite creators! to support them with <span className="font-bold text-blue-700">$IDRX</span> <Image src={IDRXLogo} alt="IDRX" width={15} height={15} className="inline-block rounded-full mb-1" />
            </div>
          </div>

          <TabsContent value="grid" className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="bg-black/60 border border-gray-800 rounded-lg overflow-hidden backdrop-blur-sm">
                    <div className="p-4">
                      <div className="flex items-center space-x-4 mb-4">
                        <Skeleton className="h-12 w-12 rounded-full bg-gray-800/50" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24 bg-gray-800/50" />
                          <Skeleton className="h-3 w-16 bg-gray-800/50" />
                        </div>
                      </div>
                      <Skeleton className="h-20 w-full rounded-md bg-gray-800/50 mb-4" />
                      <div className="flex justify-between">
                        <Skeleton className="h-8 w-20 bg-gray-800/50" />
                        <Skeleton className="h-8 w-8 rounded-full bg-gray-800/50" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <CreatorGridView creators={filteredCreators as any} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}