'use client'
import { useEffect, useState } from "react";
import { roboto, quicksand700, quicksand } from '@/public/fonts';
import Link from "next/link";
import { facebook, instagram, twitter, internet } from "@/public/icons";
import { PersonWorks } from '../../components/PersonWorks';

const PersonDetails = ({ params }) => {
  const [person, setPerson] = useState(null);
  const [movieCredits, setMovieCredits] = useState(null);
  const [social, setSocial] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const maxVisibleMovies = isMobile ? 3 : 5;
  const totalMoviesToShow = 10;

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

  const fetchPersonDetails = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/person/${params.id}?api_key=${process.env.NEXT_PUBLIC_TOKEN}`
      );
      const data = await response.json();
  
      const externalIdsResponse = await fetch(
        `https://api.themoviedb.org/3/person/${params.id}/external_ids?api_key=${process.env.NEXT_PUBLIC_TOKEN}`
      );
      const externalIdsData = await externalIdsResponse.json();

      setSocial(externalIdsData)
      setPerson(data);
    } catch (error) {
      console.error(
        "Error al obtener los detalles de la persona:",
        error
      );
    }
  };
  
  const fetchMovieCredits = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/person/${params.id}/movie_credits?api_key=${process.env.NEXT_PUBLIC_TOKEN}`);
      const data = await response.json();
      console.log(data)
      const sortedMovies = 
        data.cast.length > data.crew.length ? 
        data.cast.sort((a, b) => b.popularity - a.popularity) : 
        data.crew.sort((a, b) => b.popularity - a.popularity);
  
      const uniqueMovies = [];
      const uniqueMovieIds = new Set();
  
      for (const movie of sortedMovies) {
        if (!uniqueMovieIds.has(movie.id)) {
          uniqueMovieIds.add(movie.id);
          uniqueMovies.push(movie);
        }
      }

      setMovieCredits(uniqueMovies);
    } catch (error) {
      console.error("Error al obtener los créditos de películas de la persona:", error);
    }
  };

  const handleNext = () => {
    if (startIndex + maxVisibleMovies < totalMoviesToShow) {
      setStartIndex((prevIndex) => prevIndex + maxVisibleMovies);
    }
  };

  const handlePrev = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - maxVisibleMovies, 0));
  };
  
  useEffect(() => {
    fetchPersonDetails();
    fetchMovieCredits();
  }, [params.person]);

  if (!person) {
    return <div>Cargando...</div>;
  }

  const { name, profile_path, biography, birthday, place_of_birth, known_for_department, also_known_as, homepage, gender } = person;
  const showViewMoreButton = startIndex + maxVisibleMovies >= totalMoviesToShow;

  return (
    <div className="person-cont">
      <div className="person-tit">
        <img 
          src={`https://image.tmdb.org/t/p/w500/${profile_path}`} 
          alt={name} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/profile.jpg';
          }}
        />
        <div className="name-bio">
          <h2 className={roboto.className}>{name}</h2>
          <p className={quicksand700.className} id="bio-tit">Biography:</p>
          <p className={quicksand700.className}>{biography}</p>
        </div>
      </div>
      <div className="personal-and-movies">
        <div className="personal-info">
          {social && (
            <div className="icons">
              {social.facebook_id && (
                <div className="popover">
                  <a
                  href={`https://www.facebook.com/${social.facebook_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  >
                  {facebook}
                  </a>
                  <div className="popover-content">
                    Go to Facebook
                  </div>
                </div>
              )}
              {social.instagram_id && (
                <div className="popover">
                  <a
                    href={`https://www.instagram.com/${social.instagram_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {instagram}
                  </a>
                  <div className="popover-content">
                    Go to Instagram
                  </div>
                </div>
              )}
              {social.twitter_id && (
                <div className="popover">
                  <a
                    href={`https://www.twitter.com/${social.twitter_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {twitter}
                  </a>
                  <div className="popover-content">
                    Go to Twitter
                  </div>
                </div>
              )}
              {homepage && (
                <div className="popover">
                  <a href={homepage} target="_blank" rel="noopener noreferrer">
                    {internet}
                  </a>
                  <div className="popover-content">
                    Go to page
                  </div>
                </div>
              )}
            </div>
          )}
          <p className={quicksand700.className} id="per-tit">Personal information:</p>
          <div className="info-det">
            <p className={quicksand700.className}>Known For Department:</p>
            <p className={quicksand.className}>{known_for_department}</p>
          </div>
          <div className="info-det">
            <p className={quicksand700.className}>Gender:</p>
            <p className={quicksand.className}>{gender === 1 ? "Female" : "Male"}</p>
          </div>
          <div className="info-det">
            <p className={quicksand700.className}>Date of Birth:</p>
            <p className={quicksand.className}>{birthday}</p>
          </div>
          <div className="info-det">
            <p className={quicksand700.className}>Place of Birth:</p>
            <p className={quicksand.className}>{place_of_birth}</p>
          </div>
          <div className="info-det">
            <p className={quicksand700.className}>Aliases:</p>
            <p className={quicksand.className}>{also_known_as.join(", ")}</p>
          </div>
        </div>
        <div className="movies-list">
          <div className="carousel">
            {startIndex > 0 && (
              <button onClick={handlePrev} className="prev-button"></button>
            )}
            {movieCredits?.slice(startIndex, startIndex + maxVisibleMovies).map((movie) => (
              <Link href={`/movie/${movie.id}`} key={movie.id}>
              <div className="card">
                <img 
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} 
                  alt={movie.title} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/picture.png';
                  }}
                />
                <h3 className={roboto.className}>{movie.title}</h3>
              </div>
              </Link>
            ))}
            {!showViewMoreButton && movieCredits.length > 5 && (
              <button onClick={handleNext} className="next-button"></button>
            )}
          </div>
          <PersonWorks personId={person.id}/>
        </div>
      </div>
    </div>
  );
};

export default PersonDetails;