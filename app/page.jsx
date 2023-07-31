'use client'
import { useEffect, useState } from "react"
import { SearchBar } from "./components/SearchBar";
import { Carousel } from "./components/Carousel";
import { quicksand700 } from "@/public/fonts"; 

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);

  const getTrendingMovies = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TOKEN}`);
      const json = await response.json();
      setTrendingMovies(json.results);
    } catch (error) {
      console.error('Error retrieving movies:', error);
    }
  };

  const getTopRatedMovies = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.NEXT_PUBLIC_TOKEN}`);
      const json = await response.json();
      setTopRatedMovies(json.results);
    } catch (error) {
      console.error('Error retrieving top rated movies:', error);
    }
  };

  const getUpcomingPopularMovies = async () => {
    try {
      const currentDate = new Date().toISOString().split('T')[0];
  
      const nextMonthDate = new Date();
      nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
      const nextMonthDateString = nextMonthDate.toISOString().split('T')[0];
  
      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TOKEN}&primary_release_date.gte=${currentDate}&primary_release_date.lte=${nextMonthDateString}&sort_by=popularity.desc`);
      const json = await response.json();
      const upcomingPopularMovies = json.results;
  
      setUpcomingMovies(upcomingPopularMovies);
    } catch (error) {
      console.error('Error retrieving upcoming popular movies:', error);
    }
  };
  

  useEffect(() => {
    getTrendingMovies();
    getTopRatedMovies();
    getUpcomingPopularMovies();
  }, []);

  return (
    <div id="home">
      <SearchBar/>
      <div>
        <h3 className={quicksand700.className}>Trending movies</h3>
        <Carousel movies={trendingMovies}/>
      </div>
      <div>
        <h3 className={quicksand700.className}>Top rated movies</h3>
        <Carousel movies={topRatedMovies}/>
      </div>
      <div>
        <h3 className={quicksand700.className}>Upcoming movies</h3>
        <Carousel movies={upcomingMovies}/>
      </div>
    </div>
  );
};

export default Home;