import { useEffect, useState } from "react";
import Link from 'next/link';
import { quicksand700, roboto } from "@/public/fonts";
import { arrowRight } from "@/public/icons";

export function Casting({ movieId }) {
  const [cast, setCast] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const maxVisibleActors = isMobile ? 3 : 5;
  const totalActorsToShow = 10;
  const showViewMoreButton = startIndex + maxVisibleActors >= totalActorsToShow;

  const fetchCast = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.NEXT_PUBLIC_TOKEN}`);
      const data = await response.json();
      setCast(data.cast);
    } catch (error) {
      console.log("Error fetching cast:", error);
    }
  };

  const handleNext = () => {
    if (startIndex + maxVisibleActors < totalActorsToShow) {
      setStartIndex((prevIndex) => prevIndex + maxVisibleActors);
    }
  };

  const handlePrev = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - maxVisibleActors, 0));
  };

  useEffect(() => {
    fetchCast();
  }, [movieId]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="cast-cont">
      {cast?.length > 0 ? <h3 className={quicksand700.className} id="title-cast">Casting</h3> : null}
      {cast?.length > 0 ? <div className="cast-list">
        {startIndex > 0 && (
          <button onClick={handlePrev} className="prev-button"></button>
        )}
        {cast?.slice(startIndex, startIndex + maxVisibleActors).map((actor) => (
          <Link href={`/person/${actor.id}`} key={actor.id}>
            <div key={actor.id} className="cast-item">
              <img
                src={`https://image.tmdb.org/t/p/w500/${actor.profile_path}`}
                alt={actor.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/profile.jpg';
                }}
              />
              <div className="actor-info">
                <h3 className={roboto.className}>{actor.name}</h3>
                <p className={quicksand700.className}>{actor.character}</p>
              </div>
            </div>
          </Link>
        ))}
        {!showViewMoreButton && (
          <button onClick={handleNext} className="next-button"></button>
        )}
        {showViewMoreButton && (
          <Link href={`/movie/${movieId}/casting`}>
            <button id="view-more-button" className={quicksand700.className}>
              View More
              {arrowRight}
            </button>
          </Link>
        )}
      </div> : null}
      {cast?.length > 0 ? <Link href={`/movie/${movieId}/casting`} id="title-cast">
        <p className={quicksand700.className}>Full cast and crew {arrowRight}</p>
      </Link> : null}
    </div>
  );
}
