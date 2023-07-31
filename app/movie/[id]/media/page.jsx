'use client'
import { useState, useEffect } from 'react';
import { roboto, quicksand700 } from '@/public/fonts';
import { arrowLeft, playCir } from '@/public/icons';
import { ModalMedia } from '@/app/components/ModalMedia';
import Link from 'next/link';

const MediaDetails = ({ params }) => {
    const [videos, setVideos] = useState(null);
    const [backs, setBacks] = useState(null);
    const [posters, setPosters] = useState(null);
    const [mode, setMode] = useState('videos');
    const [movie, setMovie] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalKey, setModalKey] = useState(null);

    const fetchMovieVideos = async () => {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/movie/${params.id}/videos?api_key=${process.env.NEXT_PUBLIC_TOKEN}`);
          const data = await response.json();
          setVideos(data.results.reverse());
        } catch (error) {
          console.error('Error al obtener los videos de la película:', error);
        }
    };

    const fetchMovieBackdrops = async () => {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/movie/${params.id}/images?api_key=${process.env.NEXT_PUBLIC_TOKEN}`);
          const data = await response.json();
          setBacks(data.backdrops);
        } catch (error) {
          console.error('Error al obtener las imágenes de fondo de la película:', error);
        }
    };

    const fetchMoviePosters = async () => {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/movie/${params.id}/images?api_key=${process.env.NEXT_PUBLIC_TOKEN}`);
          const data = await response.json();
          setPosters(data.posters);
        } catch (error) {
          console.error('Error al obtener los posters de la película:', error);
        }
    };

    const getMovie = async () => {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/movie/${params.id}?api_key=${process.env.NEXT_PUBLIC_TOKEN}`);
          const movieData = await response.json();
          setMovie(movieData);
        } catch (error) {
          console.error('Error fetching movie data:', error);
        }
    };

    const handleModal = (key) => {
        setModalKey(key);
        setShowModal(true);
    }

    useEffect(() => {
        fetchMovieVideos();
        fetchMovieBackdrops();
        fetchMoviePosters();
        getMovie();
    }, [params.movie]);

    return (
        <div className='mediadet-cont'>
            <div className='back'>
                <div className='poster-name'>
                    <img src={`https://image.tmdb.org/t/p/w500/${movie?.poster_path}`} alt={movie?.title} className="poster" />
                    <div id='info'>
                        <h2 className={roboto.className}>{movie?.title}</h2>
                        <Link href={`/movie/${movie?.id}`}>
                        <button id='view-more-button' className={quicksand700.className}>
                            {arrowLeft}
                            Go back
                        </button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className='options-cont'>
                <div className='mediadet-options'>
                    <button onClick={(() => setMode('videos'))} className={quicksand700.className} id={mode === 'videos' ? 'active' : ''}>Videos ({videos?.length})</button>
                    <button onClick={(() => setMode('posters'))} className={quicksand700.className} id={mode === 'posters' ? 'active' : ''}>Posters ({posters?.length})</button>
                    <button onClick={(() => setMode('background'))} className={quicksand700.className} id={mode === 'background' ? 'active' : ''}>Background Images ({backs?.length})</button>
                </div>
                {mode === 'posters' && <div className='cont'>
                    {posters?.map((poster) => (
                        <img
                            key={poster.file_path}
                            src={`https://image.tmdb.org/t/p/w500/${poster.file_path}`}
                            alt="Movie Poster"
                            id='pos'
                            onClick={() => handleModal(poster.file_path)}
                        />
                    ))}
                </div>}
                {mode === 'background' && <div className='cont'>
                    {backs?.map((back) => (
                        <img
                            key={back.file_path}
                            src={`https://image.tmdb.org/t/p/w500/${back.file_path}`}
                            alt="Movie BackGround"
                            id='bg'
                            onClick={() => handleModal(back.file_path)}
                        />
                    ))}
                </div>}
                {mode === 'videos' && (
                    <div className='cont'>
                        {videos?.map((video) => (
                        <div className='video-thumbnail' key={video.id} onClick={() => video.key && handleModal(video.key)}>
                            <img
                            src={`https://img.youtube.com/vi/${video.key}/0.jpg`}
                            alt="Video Thumbnail"
                            id='vid'
                            />
                            {playCir}
                        </div>
                        ))}
                    </div>
                )}
            </div>
            {showModal && <ModalMedia setShowModal={setShowModal} mode={mode} modalKey={modalKey}/> }
        </div>
    )
}

export default MediaDetails;