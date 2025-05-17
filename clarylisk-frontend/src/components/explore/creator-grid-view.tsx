/* eslint-disable no-restricted-imports */
import { Creator } from '@/hooks/API/useGetCreator';
import CreatorCard from './explore-card';

interface CreatorGridViewProps {
  creators: Creator[];
}

export default function CreatorGridView({ creators }: CreatorGridViewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* {creators.map((creator) => (
        <CreatorCard key={creator.id} creator={creator} />
      ))} */}

      {creators.map((creator) => (
        <CreatorCard key={creator.idUser} creator={creator} />
      ))}
      
      {/* Empty state if no creators found */}
      {creators.length === 0 && (
        <div className="col-span-full py-16 text-center">
          <p className="text-white/60 text-lg">No creators found matching your filters.</p>
          <p className="text-white/40 mt-2">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
}