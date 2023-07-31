import { useEffect, useState } from "react";
import { roboto, quicksand700, quicksand } from '@/public/fonts';
import Link from "next/link";

export function PersonWorks({ personId }) {
  const [casts, setCasts] = useState([]);
  const [crews, setCrews] = useState([]);

  const sortedCasts = casts.filter((cast) => cast.release_date).sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
  const sortedCrews = crews.filter((crew) => crew.release_date).sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

  const fetchPersonWorks = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/person/${personId}/combined_credits?api_key=${process.env.NEXT_PUBLIC_TOKEN}`);
      const data = await response.json();
      setCasts(data.cast);
      setCrews(data.crew);
    } catch (error) {
      console.error("Error fetching person's works:", error);
    }
  };

  useEffect(() => {
    fetchPersonWorks();
  }, [personId]);

  return (
    <div className="person-wors-cont">
      <div className="cont">
        {casts.length > 0 && <h3 className={quicksand700.className}>Casting:</h3>}
        <ul>
          {sortedCasts.map((cast) => (
            <Link href={`/movie/${cast.id}`} key={cast.id}>
                <li key={cast.id} className={quicksand.className}>
                <p>
                    {new Date(cast.release_date).getFullYear()} <span className={roboto.className} id="title">{cast.title}</span>
                    <br></br>
                    <span id="work">{cast.character}</span>
                </p>
                </li>
            </Link>
          ))}
        </ul>
        {crews.length > 0 && <h3 id="cont-2" className={quicksand700.className}>Crew:</h3>}
        <ul>
          {sortedCrews.map((crew) => (
            <Link href={`/movie/${crew.id}`} key={crew.id}>
                <li key={crew.id} className={quicksand.className}>
                <p>
                    {new Date(crew.release_date).getFullYear()} <span className={roboto.className} id="title">{crew.title}</span>
                    <br></br>
                    <span id="work">{crew.job}</span>
                </p>
                </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}