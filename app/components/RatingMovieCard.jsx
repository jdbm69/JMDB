import Link from "next/link";
import { quicksand700, quicksand, barlow } from "@/public/fonts";
import { useEffect, useState } from "react";
import CircularProgressBar from "./CircularProgressBar";
import { trash, star } from "@/public/icons";

export function RatingMovieCard ({ movieId, userId, getRatings, rating }) {
    const [movie, setMovie] = useState(null);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [rating2, setRating2] = useState(rating);

    const getMovie = async () => {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_TOKEN}`);
          const movieData = await response.json();
          setMovie(movieData);
        } catch (error) {
          console.error('Error fetching movie data:', error);
        }
    };

    const handleRatingChange = (e) => {
        const value = e.target.value;
        setRating2(value);
    };
    
    const handleRateMovie = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/${userId}/rate/${movieId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ rating: rating2 }),
            });
            setRating2(rating);
        } catch (error) {
          console.error('Error:', error);
        }
        setShowRatingModal(false);
        getRatings();
    };

    const handleModalRating = () => {
        showRatingModal ? setShowRatingModal(false) : setShowRatingModal(true);
    }

    const handleDeleteToRate = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/${userId}/rating/${movie.id}`, {
              method: 'DELETE',
            });
        } catch (error) {
          console.error('Error:', error);
        }
        getRatings();
    };

    useEffect(() => {
        getMovie()
    }, [handleRateMovie])

    return (
        <div className="rating-card">
            <Link href={`/movie/${movieId}`}>
                <img 
                    src={`https://image.tmdb.org/t/p/w500/${movie?.poster_path}`} 
                    alt={movie?.title} 
                    width={500}
                    height={500}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/picture.png';
                    }}
                />
            </Link>
            <div className="info">
                <Link href={`/movie/${movieId}`}>
                    <h2 className={quicksand700.className}>{movie?.title}</h2>
                </Link>
                <div className="info2">
                    <p className={quicksand.className}>{movie?.release_date ? movie?.release_date : '-'}</p>
                    <p className={quicksand.className}>{movie?.genres.length > 0 ? movie?.genres.map((genre) => genre.name).join(', ') : '-'}</p>
                    <p className={quicksand.className}>{movie?.runtime}m</p>
                </div>
                <div className="buttons">
                    <div className="cir">
                        <CircularProgressBar progress={movie?.vote_average * 10} />
                    </div>
                    <div className="popover">
                        <button className="rate" onClick={handleModalRating}>
                            Rate: {rating}{star}
                        </button>
                        <div className="popover-content" id="content2">
                            Edit rate
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
                                        value={rating2}
                                        onChange={handleRatingChange}
                                    />
                                    <p className={barlow.className}>10</p>
                                </div>
                                <button onClick={handleRateMovie} className={quicksand700.className}>{star} Submit</button>
                            </div>
                        )}
                    </div>
                    <div className="popover">
                        <button onClick={handleDeleteToRate}>
                            {trash}
                        </button>
                        <div className="popover-content">
                            Delete rate
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}