import { heart, list, star } from "@/public/icons";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';
import { barlow, quicksand700 } from "@/public/fonts"

export function UsersPanel({ userId, movieId }) {
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isValorated, setIsValorated] = useState(false);
  const [rating, setRating] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const authToken = cookies.AuthToken;
  const router = useRouter();

  const checkIfInFavorites = async () => {
    if (userId) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/${userId}/favorites/${movieId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.isInFavorites) {
            setIsInFavorites(true);
          } else {
            setIsInFavorites(false);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const checkValue = async () => {
    if (userId) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/${userId}/rate/${movieId}`);
        if (response.ok) {
          const data = await response.json();
          setRating(data[0].valoration)
          setIsValorated(true);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const checkIfInWatchlist = async () => {
    if (userId) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/${userId}/watchlist/${movieId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.isInWatchlist) {
            setIsInWatchlist(true);
          } else {
            setIsInWatchlist(false);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleAddToFavorites = async () => {
    try {
      if (authToken) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/${userId}/favorites/${movieId}`, {
          method: 'POST',
        });
        setIsInFavorites(true);
      } else {
        router.push('/access');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddToWatchlist = async () => {
    try {
      if (authToken) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/${userId}/watchlist/${movieId}`, {
          method: 'POST',
        });
        setIsInWatchlist(true);
      } else {
        router.push('/access');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteToFavorites = async () => {
    try {
      if (authToken) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/${userId}/favorites/${movieId}`, {
          method: 'DELETE',
        });
        setIsInFavorites(false);
      } else {
        router.push('/access');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteToWatchlist = async () => {
    try {
      if (authToken) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/${userId}/watchlist/${movieId}`, {
          method: 'DELETE',
        });
        setIsInWatchlist(false);
      } else {
        router.push('/access');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRatingChange = (e) => {
    const value = e.target.value;
    setRating(value);
  };

  const handleRateMovie = async () => {
    try {
      if (authToken) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/${userId}/rate/${movieId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ rating: rating }),
        });
        setRating(rating)
      } else {
        router.push('/access');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setIsValorated(true);
    setShowRatingModal(false);
  };

  const handleModalRating = () => {
    showRatingModal ? setShowRatingModal(false) : setShowRatingModal(true);
  }

  useEffect(() => {
    checkIfInFavorites();
    checkIfInWatchlist();
    checkValue();
  }, [userId, isInFavorites, isInWatchlist]);

  return (
    <div className='users-panel'>
      <div className="popover">
        <button onClick={isInFavorites ? handleDeleteToFavorites : handleAddToFavorites} className={isInFavorites ? 'desactive' : 'active'}>
          {heart}
        </button>
        <div className="popover-content">
          {isInFavorites ? 'Delete from favorites' : 'Add to favorite'}
        </div>
      </div>
      <div className="popover">
        <button onClick={isInWatchlist ? handleDeleteToWatchlist : handleAddToWatchlist} className={isInWatchlist ? 'desactive' : 'active'}>
          {list}
        </button>
        <div className="popover-content">
          {isInWatchlist ? 'Delete from Watchlist' : 'Add to Watchlist'}
        </div>
      </div>
      <div className="popover">
        <button className={isValorated ? 'desactive' : 'active'} onClick={handleModalRating}>
          {star}
        </button>
        <div className="popover-content">
          {isValorated ? 'Rated: ' + rating : 'Rate'}
        </div>
        {showRatingModal && (
          <div className="value">
            <div className="input">
              <p className={barlow.className}>0</p>
              <input
                type="range"
                id="movie-rating"
                name="movie-rating"
                min="0"
                max="10"
                value={rating}
                onChange={handleRatingChange}
              />
              <p className={barlow.className}>10</p>
            </div>
            <button onClick={handleRateMovie} className={quicksand700.className}>{star} Submit</button>
          </div>
        )}
      </div>
    </div>
  );
}