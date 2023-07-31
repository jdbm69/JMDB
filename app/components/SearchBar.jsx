import { useState } from 'react';
import { quicksand } from '@/public/fonts';
import { search } from '@/public/icons';
import { useRouter } from 'next/navigation';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies, persons..."
          className={quicksand.className}
        />
        {search}
        <button type="submit" id="animated-button" className={quicksand.className}>
          Search
        </button>
      </form>
    </div>
  );
}