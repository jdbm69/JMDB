'use client'
import Link from 'next/link';
import { Icon } from './Icon';
import { useEffect, useState } from 'react';
import { roboto, quicksand } from '@/public/fonts';
import { search, arrowRight, equis } from '@/public/icons';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';
import { ProfileCircle } from './ProfileCircle';
import { ProfileMenu } from './ProfileMenu';

const links = [{
  route: '/movie',
  label: 'Movies',
}, {
  route: '/person',
  label: 'Persons',
}];

export function Navigation() {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [scrollCount, setScrollCount] = useState(0);
  const scrollThreshold = 70;
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const authToken = cookies.AuthToken;
  const [showProfile, setShowProfile] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const handleScroll = () => {
    const currentScrollPos = window.scrollY;
    const scrollDirection = prevScrollPos > currentScrollPos ? 'up' : 'down';

    if (scrollDirection === 'down') {
      setScrollCount((prevCount) => prevCount + 1);
    } else {
      setScrollCount(0);
    }
  
    setVisible(scrollCount <= scrollThreshold || currentScrollPos < 10);
    setPrevScrollPos(currentScrollPos);
  };

  const toggleSearch = () => {
    setShowSearch((prevShowSearch) => !prevShowSearch);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query !== '') {
      router.push(`/search?query=${query}`);
      setShowSearch(false);
      setQuery('')
    }
  };

  const handleProfileMenu = () => {
    showProfileMenu ? setShowProfileMenu(false) : setShowProfileMenu(true);
  }
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos, visible, scrollCount]);

  useEffect(() => {
    if (authToken) {
      setShowProfile(true);
    }
  })
  
  return (
    <nav className={`navbar ${visible ? '' : 'hidden'}`}>
      <ul>
        <div className='links'>
          <Link href='/'>
            <Icon />
          </Link>
          {links.map(({ label, route }) => (
            <li key={route}>
              <Link href={route} className={roboto.className}>{label}</Link>
            </li>
          ))}
        </div>
        <div className='buttons-nav'>
          {showProfile ? <button  onClick={handleProfileMenu}><ProfileCircle /></button> : <Link href='/access' className={roboto.className} id='log'>Log In</Link>}
          <button onClick={toggleSearch}>{search}</button>
        </div>
      </ul>
      {showSearch && (
        <form onSubmit={handleSearch}>
          {search}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, persons..."
            className={quicksand.className}
          />
          <button type="submit">
            {arrowRight}
          </button>
          <button onClick={(() => setShowSearch(false))}>
            {equis}
          </button>
        </form>
      )}
      {showProfileMenu && <ProfileMenu setShowProfileMenu={setShowProfileMenu}/>}
    </nav>
  );
}