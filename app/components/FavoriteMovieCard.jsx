import Link from "next/link";
import { quicksand700, quicksand } from "@/public/fonts";
import { useEffect, useState } from "react";
import CircularProgressBar from "./CircularProgressBar";
import { trash } from "@/public/icons";

export function FavoriteMovieCard ({ movieId, userId, getFavorites }) {
    const [movie, setMovie] = useState(null);

    const getMovie = async () => {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_TOKEN}`);
          const movieData = await response.json();
          setMovie(movieData);
        } catch (error) {
          console.error('Error fetching movie data:', error);
        }
    };

    const handleDeleteToFavorites = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/${userId}/favorites/${movie.id}`, {
              method: 'DELETE',
            });
        } catch (error) {
          console.error('Error:', error);
        }
    };

    useEffect(() => {
        getMovie()
        getFavorites();
    }, [handleDeleteToFavorites])

    return (
        <div className="favorite-card">
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
                        <button onClick={handleDeleteToFavorites}>
                            {trash}
                        </button>
                        <div className="popover-content">
                            Delete from favorites
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}