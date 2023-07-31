'use client'
import BackgroundProfile from "../components/BackgroundProfile";
import { ProfileCircle } from "../components/ProfileCircle";
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { quicksand700, roboto, oswald } from '@/public/fonts';
import { FavoriteMovieCard } from "../components/FavoriteMovieCard";
import { WatchListMovieCard } from "../components/WatchListMovieCard";
import { RatingMovieCard } from "../components/RatingMovieCard";

const Profile = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [name, setName] = useState(null);
  const userEmail = cookies.Email;
  const [email, setEmail] = useState(null);
  const [mode, setMode] = useState('general');
  const [favorites, setFavorites] = useState(null);
  const [watchlist, setWatchlist] = useState(null);
  const [userId, setUserId] = useState(null);
  const [rating, setRating] = useState(null);
  const [next, setNext] = useState(null);

  const getName = async () => {
    try {
      const responseName = await fetch(`${process.env.NEXT_PUBLIC_API}/name/${userEmail}`);
      const jsonName = await responseName.json();
      const responseLast = await fetch(`${process.env.NEXT_PUBLIC_API}/lastName/${userEmail}`);
      const jsonLast = await responseLast.json();
      setName(jsonName + ' ' + jsonLast);
    } catch (err) {
      console.error(err);
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

  const getFavorites = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/${userId}/favorites`);
    if (response.ok) {
      const data = await response.json();
      setFavorites(data);
    }
  }

  const getWatchlist = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/${userId}/watchlist`);
    if (response.ok) {
      const data = await response.json();
      setWatchlist(data);

      let foundMovie = null;
      for (let i = 0; i < data.length; i++) {
        if (data[i].watched === false) {
          foundMovie = data[i];
          break;
        }
      }
      setNext(foundMovie);
    }
  }

  const getRatings = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/${userId}/rating`);
    if (response.ok) {
      const data = await response.json();
      setRating(data);
    }
  }

  useEffect(() => {
    getName();
    setEmail(userEmail);
    getUserId();
  }, [])

  useEffect(() => {
    if (userId) {
      getFavorites();
      getWatchlist();
      getRatings();
    }
  }, [userId])

  return (
    <div className="profile-cont">
      <div className="head">
        <BackgroundProfile />
        <ProfileCircle />
        <div className="name-email">
          <h2 className={quicksand700.className}>{name}</h2>
          <h3>{email}</h3>
        </div>
      </div>
      <div className="links">
        <a className={quicksand700.className} onClick={() => setMode('general') } id={mode === 'general' ? 'active' : ''}>General</a>
        <a className={quicksand700.className} onClick={() => setMode('favorites')} id={mode === 'favorites' ? 'active' : ''}>Favorites</a>
        <a className={quicksand700.className} onClick={() => setMode('watchlist')} id={mode === 'watchlist' ? 'active' : ''}>Watchlist</a>
        <a className={quicksand700.className} onClick={() => setMode('ratings')} id={mode === 'ratings' ? 'active' : ''}>Ratings</a>
      </div>
      {mode === 'watchlist' && (
        <div className="body">
          {watchlist.length > 0 ? watchlist.map((watch, index) => (
            <WatchListMovieCard
              key={`watch_${index}`}
              cardId={`watch_${index}`}
              movieId={watch.movie_id}
              userId={userId}
              watched={watch.watched}
              getWatchlist={getWatchlist}
            />
          )) : <p>No movies in Watchlist</p>}
        </div>
      )}
      {mode === 'ratings' && (
        <div className="body">
          {rating.length > 0 ? rating.map((rat, index) => 
            <RatingMovieCard key={`rating_${index}`} movieId={rat.movie_id} userId={userId} getRatings={getRatings} rating={rat.valoration}/>
          ): <p>No movies in Ratings</p>}
        </div>
      )}
      {mode === 'general' && (
        <div className="body">
          <div className="estadits">
            <p className={roboto.className}>Total favorites movies: <span className={oswald.className}>{favorites?.length}</span></p>
            <p className={roboto.className}>Total watchlist movies: <span className={oswald.className}>{watchlist?.length}</span></p>
            <p className={roboto.className}>Total rated movies: <span className={oswald.className}>{rating?.length}</span></p>
          </div>
          <div className="nextwatch">
            <p className={roboto.className} id="p">Next movie in Watchlist: </p>
            {next ? <WatchListMovieCard
              key={`watch_${0}`}
              cardId={`watch_${0}`}
              movieId={next?.movie_id}
              userId={userId}
              watched={next?.watched}
              getWatchlist={getWatchlist}
            /> : <p>No movies in Watchlist to see</p>}
            <a onClick={() => setMode('watchlist')} className={quicksand700.className}>Go to Watchlist</a>
          </div>
        </div>
      )}
      {mode === 'favorites' && (
        <div className="body">
          {favorites.length > 0 ? favorites.map((favorite, index) => 
            <FavoriteMovieCard key={`favorite_${index}`} movieId={favorite.movie_id} userId={userId} getFavorites={getFavorites}/>
          ): <p>No movies in Favorites</p>}
        </div>
      )}
    </div>
  )
}

export default Profile;