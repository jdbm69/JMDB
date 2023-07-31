import { useState, useEffect } from 'react';
import { MovieCard } from './MovieCard';

export function Carousel({ movies }) {
  const [startIndex, setStartIndex] = useState(0);
  const [transitionClass, setTransitionClass] = useState('');
  const [isMobile, setIsMobile] = useState(false);

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

  const numVisibleMovies = isMobile ? 3 : 5;
  const endIndex = Math.min(startIndex + numVisibleMovies, movies.length);
  const visibleMovies = movies.slice(startIndex, endIndex);

  const goToNextSlide = () => {
    setTransitionClass('next');
    setTimeout(() => {
      const nextIndex = startIndex + numVisibleMovies;
      if (nextIndex >= movies.length) {
        setStartIndex(0);
      } else {
        setStartIndex(nextIndex);
      }
      setTransitionClass('');
    }, 1000);
  };

  const goToPrevSlide = () => {
    setTransitionClass('prev');
    setTimeout(() => {
      const prevIndex = startIndex - numVisibleMovies;
      if (prevIndex < 0) {
        setStartIndex(movies.length - numVisibleMovies);
      } else {
        setStartIndex(prevIndex);
      }
      setTransitionClass('');
    }, 1000);
  };

  const showViewMoreButton = endIndex === movies.length;

  return (
    <div className='container-carousel'>
      <button
        className="prev-button"
        onClick={goToPrevSlide}
        style={{ visibility: startIndex > 0 ? 'visible' : 'hidden' }}
      >
      </button>
      <div className="carousel">
        <div className={`slides ${transitionClass}`}>
          {visibleMovies.map((movie, index) => (
            <div key={index} className="slide">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
      {!showViewMoreButton && (
        <button className="next-button" onClick={goToNextSlide}></button>
      )}
    </div>
  );
}

export default Carousel;
