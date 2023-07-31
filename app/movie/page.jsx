'use client'
import { useState, useEffect } from 'react';
import { MovieCard } from '../components/MovieCard';
import { quicksand700, quicksand } from '@/public/fonts';
import { miniArrowLeft, miniArrowRght } from '@/public/icons';
import { LoadingPage } from '../components/LoadingPage';

const Movie = () => {
  const [movies, setMovies] = useState([]);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [genre, setGenre] = useState('');

  const fetchMovies = async (page = 1) => {
    setIsLoading(true);
    try {
      let apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TOKEN}&sort_by=${sortBy}&page=${page}`;

      if (sortBy === 'vote_average.desc' && genre === '') {
        apiUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.NEXT_PUBLIC_TOKEN}&page=${page}`;
      } else if (sortBy === 'upcoming' && genre === '') {
        const currentDate = new Date().toISOString().split('T')[0];
        apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TOKEN}&primary_release_date.gte=${currentDate}&sort_by=popularity.desc&page=${page}`;
      } else if  (sortBy === 'vote_average.desc' && genre !== '') {
        apiUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.NEXT_PUBLIC_TOKEN}&page=${page}&with_genres=${genre}`;
      } else if  (sortBy === 'upcoming' && genre !== '') {
        const currentDate = new Date().toISOString().split('T')[0];
        apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TOKEN}&primary_release_date.gte=${currentDate}&sort_by=popularity.desc&page=${page}&with_genres=${genre}`;
      } else {
        apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TOKEN}&sort_by=${sortBy}&page=${page}&with_genres=${genre}`;
      }

      const response = await fetch(apiUrl);
      const data = await response.json();
      setMovies(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortByChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchMovies(page);
  };

  const handleGenreChange = (value) => {
    setGenre(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchMovies();
  }, [sortBy, genre]);

  return (
    <div className='movie-cont'>
      <div className='form-movie-list'>
        <div className='form'>
          <label htmlFor='sort-by' className={quicksand700.className}>Sort by: </label>
          <select
            id='sort-by'
            value={sortBy}
            onChange={(e) => handleSortByChange(e.target.value)}
            className={quicksand.className}
          >
            <option value='popularity.desc' className={quicksand.className}>Popularity</option>
            <option value='vote_average.desc' className={quicksand.className}>Rating</option>
            <option value='release_date.asc' className={quicksand.className}>Release Date ascendant</option>
            <option value='release_date.desc' className={quicksand.className}>Release Date descendant</option>
            <option value='original_title.asc' className={quicksand.className}>Alphabetical (A-Z)</option>
            <option value='original_title.desc' className={quicksand.className}>Alphabetical (Z-A)</option>
            <option value='upcoming' className={quicksand.className}>Upcoming</option>
          </select>
          <label htmlFor='sort-by' className={quicksand700.className}>Genre: </label>
          <select
            id='genre'
            value={genre}
            onChange={(e) => handleGenreChange(e.target.value)}
            className={quicksand.className}
          >
            <option value=''>All Genres</option>
            <option value='28'>Action</option>
            <option value='12'>Adventure</option>
            <option value='16'>Animation</option>
            <option value='35'>Comedy</option>
            <option value='80'>Crime</option>
            <option value='99'>Documentary</option>
            <option value='18'>Drama</option>
            <option value='10751'>Family</option>
            <option value='14'>Fantasy</option>
            <option value='36'>History</option>
            <option value='27'>Horror</option>
            <option value='10402'>Music</option>
            <option value='9648'>Mystery</option>
            <option value='10749'>Romance</option>
            <option value='878'>Science Fiction</option>
            <option value='10770'>TV Movie</option>
            <option value='53'>Thriller</option>
            <option value='10752'>War</option>
            <option value='37'>Western</option>
          </select>
        </div>
        <div className='movies-list'>
          {isLoading ? (
            <LoadingPage />
          ) : (
            movies.map((movie) => <MovieCard movie={movie} key={movie.id} />)
          )}
        </div>
      </div>
      <div className='pagination'>
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className={quicksand700.className}
          >
            {miniArrowLeft}
            Prev
          </button>
        )}
        <span className={quicksand700.className}>{currentPage}</span>
        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className={quicksand700.className}
          >
            Next
            {miniArrowRght}
          </button>
        )}
      </div>
    </div>
  );
};

export default Movie;