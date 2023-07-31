import CircularProgressBar from "./CircularProgressBar"
import Link from 'next/link';
import { roboto, quicksand } from "@/public/fonts";

export function MovieCard ({ movie }) {
  const releaseDate = new Date(movie.release_date);
  const formattedDate = releaseDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  
  return (
    <Link href={`/movie/${movie.id}`} className="link-button">
      <button key={movie.id} className="movie-button">
        <img 
          src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} 
          alt={movie.title} 
          width={500}
          height={500}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/picture.png';
          }}
        />
        <CircularProgressBar progress={movie.vote_average * 10} />
        <h2 className={roboto.className}>{movie.title}</h2>
        <p className={quicksand.className}>{formattedDate}</p>
      </button>
    </Link>
  );
}