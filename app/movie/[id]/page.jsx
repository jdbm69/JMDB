'use client'
import { useState, useEffect } from 'react';
import CircularProgressBar from '../../components/CircularProgressBar';
import { Trailer } from '../../components/Trailer';
import { roboto, quicksand700 } from '@/public/fonts';
import { circleFill, playBtn } from '@/public/icons';
import { Casting } from '@/app/components/Casting';
import { SocialMedia } from '@/app/components/SocialMedia';
import { Media } from '@/app/components/Media';
import { RecommendedMovies } from '@/app/components/RecommendedMovies';
import { useCookies } from 'react-cookie';
import { UsersPanel } from '@/app/components/UsersPanel';

const MovieDetails = ({ params }) => {
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const userEmail = cookies.Email;

  const getMovie = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${params.id}?api_key=${process.env.NEXT_PUBLIC_TOKEN}`);
      const movieData = await response.json();
      setData(movieData);
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };

  const getUserId = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/id/${userEmail}`);
      const json = await response.json();
      setUserId(json)
    } catch (err) {
      console.error(err);
    }
  }
  
  useEffect(() => {
    getUserId();
    getMovie();
  }, [params.movie]);

  if (!data) {
    return <div>Loading...</div>;
  }

  const backdrop = `https://image.tmdb.org/t/p/original/${data.backdrop_path}`;
  const voteAverage = Math.ceil(data.vote_average * 10);
  const percentage = Math.min(voteAverage, 100);

  return (
    <div className="movie-det-cont">
      <div className="background-col">
        <div className="background-img" style={{ backgroundImage: `url(${backdrop})` }}></div>
          <img 
            src={`https://image.tmdb.org/t/p/w500/${data.poster_path}`} 
            alt={data.title} 
            className="poster" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/picture.png';
            }}
          />
          <div className="info">
            <h2 className={roboto.className}>{data.title ? data.title : '-'}</h2>
            <div className="info2">
              <p className={quicksand700.className}>{data.release_date ? data.release_date : '-'}</p>
              {circleFill}
              <p className={quicksand700.className}>{data.genres.length > 0 ? data.genres.map((genre) => genre.name).join(', ') : '-'}</p>
              {circleFill}
              <p className={quicksand700.className}>{data.runtime}m</p>
            </div>
            <div className="cir">
              <CircularProgressBar progress={percentage} />
              <p className={quicksand700.className}>User rating</p>
              <UsersPanel userId={userId} movieId={params.id}/>
            </div>
            <div className="overvw">
              <p id="overvw-t" className={quicksand700.className}>Overview:</p>
              <p className={quicksand700.className}>{data.overview ? data.overview : 'No info'}</p>
            </div>
            <button id="trailer-btn" onClick={() => setShowModal(true)} className={quicksand700.className}>
              {playBtn}
              Trailer
            </button>
          </div>
      </div>
      {showModal && <Trailer setShowModal={setShowModal} movie={data}/>}
      <Casting movieId={data.id} />
      <SocialMedia movieId={data.id} />
      <Media movieId={data.id} />
      <RecommendedMovies movieId={data.id} />
    </div>
  );
};

export default MovieDetails;