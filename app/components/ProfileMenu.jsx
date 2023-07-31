import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { quicksand700, quicksand } from '@/public/fonts';
import Link from 'next/link';

export function ProfileMenu ({ setShowProfileMenu }) {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [name, setName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const userEmail = cookies.Email;

  const signOut = () => {
    removeCookie('Email');
    removeCookie('AuthToken');  
    window.location.href = '/'
  }

  const getName = async () => {
    try {
      const responseName = await fetch(`${process.env.NEXT_PUBLIC_API}/name/${userEmail}`);
      const jsonName = await responseName.json();
      const responseLast = await fetch(`${process.env.NEXT_PUBLIC_API}/lastName/${userEmail}`);
      const jsonLast = await responseLast.json();
      setName(jsonName + ' ' + jsonLast);
    } catch (err) {
      console.error(err);
    }
  };
    
  useEffect(() => {
    getName();
  })

  return (
    <div className="profile-menu-cont">
      <p className={quicksand700.className}>{name}</p>
      <a onClick={signOut} className={quicksand.className} id='border'>Sign Out</a>
      <Link href='/profile' onClick={() => setShowProfileMenu(false)} className={quicksand.className} id='border-radius'>View Profile</Link>
    </div>
  )
}