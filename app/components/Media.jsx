import { useState, useEffect } from 'react';
import { quicksand700, quicksand } from '@/public/fonts';
import { arrowRight } from '@/public/icons';
import Link from 'next/link';

export function Media({ movieId }) {
  const [mode, setMode] = useState(null);
  const [videos, setVideos] = useState(null);
  const [backs, setBacks] = useState(null);
  const [posters, setPosters] = useState(null);
  const [startIndexVideos, setStartIndexVideos] = useState(0);
  const [startIndexBackgrounds, setStartIndexBackgrounds] = useState(0);
  const [startIndexPosters, setStartIndexPosters] = useState(0);
  const [showMoreVideos, setShowMoreVideos] = useState(true);
  const [showMoreBackgrounds, setShowMoreBackgrounds] = useState(true);
  const [showMorePosters, setShowMorePosters] = useState(true);
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

  const numVisibleBackgrounds = isMobile ? 1 : 2;
  const numVisibleVideos = isMobile ? 1 : 2;
  const numVisiblePosters = isMobile ? 2 : 4;
  const totalItemsToShow = 10;

  const fetchMovieVideos = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.NEXT_PUBLIC_TOKEN}`);
      const data = await response.json();
      setVideos(data.results);
    } catch (error) {
      console.error('Error al obtener los videos de la película:', error);
    }
  };

  const fetchMovieBackdrops = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${process.env.NEXT_PUBLIC_TOKEN}`);
      const data = await response.json();
      setBacks(data.backdrops);
    } catch (error) {
      console.error('Error al obtener las imágenes de fondo de la película:', error);
    }
  };

  const fetchMoviePosters = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${process.env.NEXT_PUBLIC_TOKEN}`);
      const data = await response.json();
      setPosters(data.posters);
    } catch (error) {
      console.error('Error al obtener los posters de la película:', error);
    }
  };

  const handleNext = () => {
    if (mode === 'videos') {
      if (startIndexVideos + numVisibleVideos < totalItemsToShow) {
        setStartIndexVideos((prevIndex) => prevIndex + numVisibleVideos);
      }
      setShowMoreVideos(startIndexVideos + numVisibleVideos + numVisibleVideos < totalItemsToShow);
    } else if (mode === 'background') {
      if (startIndexBackgrounds + numVisibleBackgrounds < totalItemsToShow) {
        setStartIndexBackgrounds((prevIndex) => prevIndex + numVisibleBackgrounds);
      }
      setShowMoreBackgrounds(startIndexBackgrounds + numVisibleBackgrounds + numVisibleBackgrounds < totalItemsToShow);
    } else if (mode === 'posters') {
      if (startIndexPosters + numVisiblePosters < totalItemsToShow) {
        setStartIndexPosters((prevIndex) => prevIndex + numVisiblePosters);
      }
      setShowMorePosters(startIndexPosters + numVisiblePosters + numVisiblePosters < totalItemsToShow);
    }
  };

  const handlePrev = () => {
    if (mode === 'videos') {
      setStartIndexVideos((prevIndex) => Math.max(prevIndex - numVisibleVideos, 0));
      setShowMoreVideos(true);
    } else if (mode === 'background') {
      setStartIndexBackgrounds((prevIndex) => Math.max(prevIndex - numVisibleBackgrounds, 0));
      setShowMoreBackgrounds(true);
    } else if (mode === 'posters') {
      setStartIndexPosters((prevIndex) => Math.max(prevIndex - numVisiblePosters, 0));
      setShowMorePosters(true);
    }
  };

  useEffect(() => {
    fetchMovieVideos();
    fetchMovieBackdrops();
    fetchMoviePosters();
  }, []);

  useEffect(() => {
    setStartIndexVideos(0);
    setStartIndexBackgrounds(0);
    setStartIndexPosters(0);
    setShowMoreVideos(true);
    setShowMoreBackgrounds(true);
    setShowMorePosters(true);
  }, [mode]);

  useEffect(() => {
    if (videos?.length > 0) {
      setMode('videos');
    } else if (backs?.length > 0) {
      setMode('background');
    } else if (posters?.length > 0) {
      setMode('posters')
    }
  }, [videos, backs, posters])

  return (
    <div className='media-cont'>
      <div className='media-title'>
        {mode !== null ? <h3 className={quicksand700.className}>Media</h3> : null}
        <ul>
          {videos?.length > 0 ? <li onClick={() => setMode('videos')} className={quicksand700.className} id={mode === 'videos' ? 'active' : ''}>Videos</li> : null}
          {backs?.length > 0 ? <li onClick={() => setMode('background')} className={quicksand700.className} id={mode === 'background' ? 'active' : ''}>Background images</li> : null}
          {posters?.length > 0 ? <li onClick={() => setMode('posters')} className={quicksand700.className} id={mode === 'posters' ? 'active' : ''}>Posters</li> : null}
        </ul>
        {videos?.length > 0 || backs?.length > 0 || posters?.length > 0 ? <Link href={`/movie/${movieId}/media`}>
          <button className={quicksand.className}>Watch all</button>
        </Link> : null}
      </div>
      {mode === 'posters' && posters?.length > 0 ?
        <div className="carr-cont">
          <button onClick={handlePrev} className={startIndexPosters > 0 ? 'prev-button-act' : 'prev-button'}></button>
          <div className='container'>
            {posters?.slice(startIndexPosters, startIndexPosters + numVisiblePosters).map((poster) => (
              <img
                key={poster.file_path}
                src={`https://image.tmdb.org/t/p/w500/${poster.file_path}`}
                alt="Movie Poster"
                id='pos'
                width={500}
                height={500}
              />
            ))}
          </div>
          {showMorePosters && (
            <button onClick={handleNext} className="next-button"></button>
          )}
          {!showMorePosters && (
            <Link href={`/${movieId}/media`}>
              <button id="view-more-button" onClick={handleNext} className={quicksand700.className}>
                View More
                {arrowRight}
              </button>
            </Link>
          )}
        </div>
        : null}
      {mode === 'background' && backs?.length > 0 ?
        <div className="carr-cont">
          <button onClick={handlePrev} className={startIndexBackgrounds > 0 ? 'prev-button-act' : 'prev-button'}></button>
          <div className='container'>
            {backs?.slice(startIndexBackgrounds, startIndexBackgrounds + numVisibleBackgrounds).map((back) => (
              <img
                key={back.file_path}
                src={`https://image.tmdb.org/t/p/w500/${back.file_path}`}
                alt="Movie BackGround"
                id='bg'
                width={500}
                height={500}
              />
            ))}
          </div>
          {showMoreBackgrounds && (
            <button onClick={handleNext} className="next-button"></button>
          )}
          {!showMoreBackgrounds && (
            <Link href={`/${movieId}/media`}>
              <button id="view-more-button" onClick={handleNext} className={quicksand700.className}>
                View More
                {arrowRight}
              </button>
            </Link>
          )}
        </div>
        : null}
      {mode === 'videos' && videos?.length > 0 ?
        <div className="carr-cont">
          <button onClick={handlePrev} className={startIndexVideos > 0 ? 'prev-button-act' : 'prev-button'}></button>
          <div className='container'>
            {videos?.slice(startIndexVideos, startIndexVideos + numVisibleVideos).map((video) => (
              <iframe
                src={`https://www.youtube.com/embed/${video.key}`}
                title={video.name}
                allowFullScreen
                key={video.id}
              />
            ))}
          </div>
          {showMoreVideos && (
            <button onClick={handleNext} className="next-button"></button>
          )}
          {!showMoreVideos && (
            <Link href={`/${movieId}/media`}>
              <button id="view-more-button" onClick={handleNext} className={quicksand700.className}>
                View More
                {arrowRight}
              </button>
            </Link>
          )}
        </div>
        : null}
    </div>
  );
}
