'use client'
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { MovieCard } from '../components/MovieCard';
import { roboto, quicksand700, quicksand } from '@/public/fonts';
import Link from 'next/link';
import { miniArrowLeft, miniArrowRght, search } from '@/public/icons';
import { LoadingPage } from '../components/LoadingPage';

const SearchPage = () => {
  const [query, setQuery] = useState(useSearchParams().get('query'));
  const [movies, setMovies] = useState([]);
  const [persons, setPersons] = useState([]);
  const [mode, setMode] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);
  const [totalPersons, setTotalPersons] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const searchMovies = async (page = 1) => {
    try {
      setIsLoading(true);
      const responseMovies = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TOKEN}&query=${query}&page=${page}`);
      const data = await responseMovies.json();
      setMovies(data.results);
      setTotalPages(data.total_pages);

      const responseTotalMovies = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TOKEN}&query=${query}`);
      const total = await responseTotalMovies.json();
      setTotalMovies(total.total_results);
      setIsLoading(false);
    } catch (error) {
      console.error('Error searching movies:', error);
      setIsLoading(false);
    }
  };

  const searchPersons = async (page = 1) => {
    try {
      setIsLoading(true);
      const responsePersons = await fetch(`https://api.themoviedb.org/3/search/person?api_key=${process.env.NEXT_PUBLIC_TOKEN}&query=${query}&page=${page}`);
      const data = await responsePersons.json();
      setPersons(data.results);
      setTotalPages(data.total_pages);

      const responseTotalPersons = await fetch(`https://api.themoviedb.org/3/search/person?api_key=${process.env.NEXT_PUBLIC_TOKEN}&query=${query}`);
      const total = await responseTotalPersons.json();
      setTotalPersons(total.total_results);
      setIsLoading(false);
    } catch (error) {
      console.error('Error searching persons:', error);
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (mode === 'movies') {
      searchMovies(page);
    } else if (mode === 'persons') {
      searchPersons(page);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchMovies();
    searchPersons();
  };
  
  useEffect(() => {
    setCurrentPage(1);
  }, [mode]);

  useEffect(() => {
    searchMovies();
    searchPersons();
  }, []);

  useEffect(() => {
    if (movies.length === 0) {
      setMode('persons');
    } else {
      setMode('movies');
    }
  }, [movies]);
  
  return (
    <div className='pagin-cont'>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <>
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
        <div className='search-cont'>
          <div className='buttons-list'>
            <div className='buttons'>
              <button onClick={() => setMode('movies')} className={quicksand700.className} id={mode === 'movies' ? 'active' : ''}>
                Movies ({totalMovies})
              </button>
              <button onClick={() => setMode('persons')} className={quicksand700.className} id={mode === 'persons' ? 'active' : ''}>
                Persons ({totalPersons})
              </button>
            </div>  
            {mode === 'movies' && (
              <div className='list'>
                {movies.length > 0 ? (
                  movies.map((movie) => (
                    <MovieCard movie={movie} key={movie.id} />
                  ))
                ) : (
                  <p className={roboto.className}>No results</p>
                )}
              </div>
            )}
            {mode === 'persons' && (
              <div className='list'>
                {persons.length > 0 ? (
                  persons.map((person) => (
                    <Link href={`/person/${person.id}`} key={person.id}>
                      <div className='person-item'>
                        <img
                          src={`https://image.tmdb.org/t/p/w500/${person.profile_path}`}
                          alt={person.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/profile.jpg';
                          }}
                        />
                        <div className='person-info'>
                          <h3 className={roboto.className}>{person.name}</h3>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className={roboto.className}>No results</p>
                )}
              </div>
            )}
          </div>
        </div>
        <div className='pagination'>
          {currentPage > 1 && (
            <button onClick={() => handlePageChange(currentPage - 1)} className={quicksand700.className}>
              {miniArrowLeft}
              Prev
            </button>
          )}
          <span className={quicksand700.className}>{currentPage}</span>
          {currentPage < totalPages && (
            <button onClick={() => handlePageChange(currentPage + 1)} className={quicksand700.className}>
              Next
              {miniArrowRght}
            </button>
          )}
        </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;