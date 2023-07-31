import { useEffect, useState } from "react";
import { facebook, twitter, instagram, internet } from "@/public/icons";
import { quicksand, quicksand700 } from "@/public/fonts";

export function SocialMedia({ movieId }) {
  const [social, setSocial] = useState(null);
  const [homePage, setHomePage] = useState(null);
  const [info, setInfo] = useState(null);

  const languageMap = {
    en: "English",
    es: "Spanish",
    fr: "French",
  };

  const getSocial = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_TOKEN}&append_to_response=external_ids`);
      const movieData = await response.json();
      setInfo(movieData);
      setSocial(movieData.external_ids);
      setHomePage(movieData.homepage);
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };

  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const getLanguageName = (code) => {
    return languageMap[code] || code;
  };

  useEffect(() => {
    getSocial();
  }, []);

  return (
    <div className="social-media">
      {info && (
        <div className="info">
          <div className="info-det">
            <p className={quicksand700.className}>Status</p>
            <p className={quicksand.className}>{info.status ? info.status : '-'}</p>
          </div>
          <div className="info-det">
            <p className={quicksand700.className}>Original language</p>
            <p className={quicksand.className}>{info.original_language ? getLanguageName(info.original_language) : '-'}</p>
          </div>
          <div className="info-det">
            <p className={quicksand700.className}>Budget</p>
            <p className={quicksand.className}>{formatCurrency(info.budget)}</p>
          </div>
          <div className="info-det">
            <p className={quicksand700.className}>Box Office Collection</p>
            <p className={quicksand.className}>{formatCurrency(info.revenue)}</p>
          </div>
        </div>
      )}
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
          {homePage && (
            <div className="popover">
              <a href={homePage} target="_blank" rel="noopener noreferrer">
                {internet}
              </a>
              <div className="popover-content">
                Go to page
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}