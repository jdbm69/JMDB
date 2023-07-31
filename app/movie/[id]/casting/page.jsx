'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { quicksand, quicksand700, roboto } from '@/public/fonts';
import { arrowLeft } from '@/public/icons';

const CastingDetails = ({ params }) => {
  const [credits, setCredits] = useState(null);
  const [movie, setMovie] = useState(null);

  const fetchCredits = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${params.id}/credits?api_key=${process.env.NEXT_PUBLIC_TOKEN}`);
      const data = await response.json();
      setCredits(data);
    } catch (error) {
      console.log("Error fetching credits:", error);
    }
  };

  const getMovie = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${params.id}?api_key=${process.env.NEXT_PUBLIC_TOKEN}`);
      const movieData = await response.json();
      setMovie(movieData);
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };

  useEffect(() => {
    getMovie();
    fetchCredits();
  }, [params.movie]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="casting">
      <div className='back'>
        <div className='poster-name'>
          <img 
            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} 
            alt={movie.title} 
            className="poster" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/picture.png';
            }}
          />
          <div id='info'>
            <h2 className={roboto.className}>{movie.title}</h2>
            <Link href={`/movie/${movie.id}`}>
              <button id='view-more-button' className={quicksand700.className}>
                {arrowLeft}
                Go back
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className='container-act-team'>
        <div className="actors">
          <h3 id='title' className={quicksand700.className}>Casting <span className={quicksand.className}>({credits?.cast.length})</span></h3>
          {credits?.cast.map((actor) => (
            <Link href={`/person/${actor.id}`} key={actor.id}>
            <div key={actor.id} className='cont'>
              <img
                src={`https://image.tmdb.org/t/p/w500/${actor.profile_path}`}
                alt={actor.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/profile.jpg';
                }}
              />
              <div className='name'>
                <h3 className={roboto.className}>{actor.name}</h3>
                <p className={quicksand700.className}>{actor.character}</p>
              </div>
            </div>
            </Link>
          ))}
        </div>
        <div className="crew">
          <h3 id='title' className={quicksand700.className}>Team <span className={quicksand.className}>({credits?.crew.length})</span></h3>
          {credits?.crew.map((member) => (
            <Link href={`/person/${member.id}`} key={member.id}>
            <div key={member.id} className='cont'>
              <img
                src={`https://image.tmdb.org/t/p/w500/${member.profile_path}`}
                alt={member.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/profile.jpg';
                }}
              />
              <div className='name'>
                <h3 className={roboto.className}>{member.name}</h3>
                <p className={quicksand700.className}>{member.job}</p>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CastingDetails;