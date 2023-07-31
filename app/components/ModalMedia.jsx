import { equis } from "@/public/icons"
import { quicksand } from "@/public/fonts"

export function ModalMedia ({ setShowModal, mode, modalKey }) {

    const handleClose = () => {
        document.getElementById("modalT").style.animation = 'zoomOut 1s';
        setTimeout(() => {
            setShowModal(false);
        }, 600);
    }

    return (
        <div className="modalm-overlay">
            <div className="modal-content" id="modalT">
                <div className="modal-close">
                    <p className={quicksand.className}>{mode === 'posters' ? 'Poster' : mode === 'videos' ? 'Video' : 'Background Image'}</p>
                    <button onClick={handleClose}>
                        {equis}
                    </button>
                </div>
                <div className="mediam-cont">
                    {mode === 'videos' && 
                        <iframe
                            src={`https://www.youtube.com/embed/${modalKey}`}
                            title="Trailer"
                            
                        >
                        </iframe>
                    } 
                    {mode === 'posters' &&
                        <img
                            src={`https://image.tmdb.org/t/p/original/${modalKey}`}
                            alt="Video Thumbnail"
                            id="posters"
                        />
                    }
                    {mode === 'background' &&
                        <img
                            src={`https://image.tmdb.org/t/p/original/${modalKey}`}
                            alt="Video Thumbnail"
                            id="backgrounds"
                        />
                    }
                </div>   
            </div>
        </div>
    )
}