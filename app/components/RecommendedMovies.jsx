import { useState, useEffect } from 'react';
import { quicksand700 } from '@/public/fonts';
import { Carousel } from './Carousel';

export function RecommendedMovies ({ movieId }) {
  const [recommendedMovies, setRecommendedMovies] = useState([]);

  const fetchRecommendedMovies = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${process.env.NEXT_PUBLIC_TOKEN}`);
      const data = await response.json();
      setRecommendedMovies(data.results);
    } catch (error) {
      console.error('Error fetching recommended movies:', error);
      }
  }

  useEffect(() => {
    fetchRecommendedMovies();
  }, [movieId]);

  return (
    <div className='recom-cont'>
      {recommendedMovies.length > 0 ? <h3 className={quicksand700.className}>Recommended movies</h3> : null}
      {recommendedMovies.length > 0 ? <Carousel movies={recommendedMovies}/> : null}
    </div>
  );
};