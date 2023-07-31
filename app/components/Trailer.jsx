import { useEffect, useState } from "react";
import { quicksand } from "@/public/fonts";
import { equis } from "@/public/icons";

export function Trailer ({ setShowModal, movie }) {
    const [trailerKey, setTrailerKey] = useState('');

    const fetchTrailerKey = async () => {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${process.env.NEXT_PUBLIC_TOKEN}`);
          const json = await response.json();
          const videos = json.results;
          const trailer = videos.find((video) => video.type === 'Trailer');
    
          if (trailer) {
            setTrailerKey(trailer.key);
          }
        } catch (error) {
          console.error('Error retrieving trailer:', error);
        }
    };

    const handleClose = () => {
        document.getElementById("modalT").style.animation = 'zoomOut 1s';
        setTimeout(() => {
          setShowModal(false);
        }, 600);
    }

    useEffect(() => {
        fetchTrailerKey();
    }, []);

    return ( 
        <div className="modal-overlay">
            <div className="modal-content" id="modalT">
                <div className="modal-close">
                    <p className={quicksand.className}>Trailer</p>
                    <button onClick={handleClose}>
                        {equis}
                    </button>
                </div>
                <div className="traier-cont">
                    {trailerKey ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${trailerKey}`}
                            title="Trailer"
                            allowFullScreen
                        >
                        </iframe>
                    ) : <p>No media</p>}
                </div>   
            </div>
        </div>
    )
};