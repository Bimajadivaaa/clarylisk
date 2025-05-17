import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ExploreFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sort: string;
  setSort: (sort: string) => void;
}

export default function ExploreFilters({
  searchTerm,
  setSearchTerm,
  sort,
  setSort
}: ExploreFiltersProps) {
  return (
    <div className="mb-8 grid gap-4 md:grid-cols-2">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Search creators by name or description..."
          className="pl-10 bg-gray-800/50 border-gray-700 text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div>
        {/* <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-white">
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="donations">Highest Donations</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select> */}
      </div>
    </div>
  );
}