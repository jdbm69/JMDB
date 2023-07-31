'use client'
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { quicksand700 } from '@/public/fonts';

export function ProfileCircle () {
    const [cookies, setCookie, removeCookie] = useCookies(null);
    const [name, setName] = useState(null);
    const userEmail = cookies.Email;

    const getName = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API}/name/${userEmail}`);
          const json = await response.json();
          setName(json[0])
        } catch (err) {
          console.error(err);
        }
    };

    useEffect(() => {
        getName();
    })

    return (
        <div className='profile-circle'>
            <p className={quicksand700.className}>{name}</p>
        </div>
    )
}