'use client';
import { useState } from 'react';
import { quicksand700, quicksand } from '@/public/fonts';
import {  useCookies } from 'react-cookie';
import { LoadingPage } from '../components/LoadingPage';

const Access = () => {
    const [cookies, setCookie, removeCookie] = useCookies(null);
    const [error, setError] = useState(null);
    const [isLogIn, setIsLogIn] = useState(true);
    const [email, setEmail] = useState(null);
    const [name, setName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [showPassword, setShowPassword] = useState(true);
    const [showConfirmPassword, setShowConfirmPassword] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handleClean = (bool) => {
        viewLogin(bool);
        setShowPassword(true);
        setShowConfirmPassword(true);
        const collection = document.getElementsByTagName('input');
        for (let i = 0; i < collection.length; i++) {
          collection[i].value = '';
        }
    };

    const viewLogin = (status) => {
        setIsLogIn(status);
        setError(null);
    };

    const handleSubmit = async (e, endpoint) => {
        e.preventDefault();
        setIsLoading(true);
        if (!isLogIn && password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
      
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, lastName })
        });
      
        const data = await response.json();
      
        if (data.detail) {
          setError(data.detail);
        } else {
          setCookie('Email', data.email);
          setCookie('AuthToken', data.token);
          setIsLoading(false);
          window.location.href = '/profile';
        }
    };
      

    return (
        <div className="login-cont">
            {isLoading ? (
                <LoadingPage />
            ) : (
            <div className="auth-box">
                <h2 className={quicksand700.className}>{isLogIn ? 'Log in to your account' : 'Create an account'}</h2>
                <form>
                    <input type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} className={quicksand700.className}/>
                    {!isLogIn && 
                        <>
                        <input 
                            type='name' 
                            placeholder='Name'
                            onChange={(e) => setName(e.target.value)} 
                            className={quicksand700.className}
                        />
                        <input 
                            type='lastName' 
                            placeholder='Last name' 
                            onChange={(e) => setLastName(e.target.value)} 
                            className={quicksand700.className}
                        />
                        </>
                    }
                    <div className='ip'>
                        <input 
                        type={showPassword ? 'password' : 'text'} 
                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)} 
                        className={quicksand700.className}
                        />
                        {!showPassword && 
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="currentColor" 
                            className="bi bi-eye-fill" 
                            viewBox="0 0 16 16" 
                            onClick={() => setShowPassword(true)}
                        >
                            <path 
                            d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"
                            />
                            <path 
                            d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"
                            />
                        </svg>
                        }
                        {showPassword && 
                        <svg 
                            xmlns="http://www.w3.org/2000/svg"  
                            fill="currentColor" 
                            className="bi bi-eye-slash-fill" 
                            viewBox="0 0 16 16" 
                            onClick={() => setShowPassword(false)}
                        >
                            <path 
                            d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 
                            0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 
                            0 0 0-4.474-4.474L5.21 3.089z"
                            />
                            <path 
                            d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 
                            6-12-12 .708-.708 12 12-.708.708z"
                            />
                        </svg>
                        }
                    </div>
                    {!isLogIn && 
                        <div className='ipconfirm'>
                        <input 
                            type={showConfirmPassword ? 'password' : 'text'} 
                            placeholder='Confirm Password' 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            className={quicksand700.className}
                        />
                        {!showConfirmPassword && 
                            <svg 
                            xmlns="http://www.w3.org/2000/svg"  
                            fill="currentColor" 
                            className="bi bi-eye-fill" 
                            viewBox="0 0 16 16" 
                            onClick={() => setShowConfirmPassword(true)}
                            >
                            <path 
                                d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"
                            />
                            <path 
                                d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"
                            />
                            </svg>
                        }
                        {showConfirmPassword && 
                            <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="currentColor" 
                            className="bi bi-eye-slash-fill" 
                            viewBox="0 0 16 16" 
                            onClick={() => setShowConfirmPassword(false)}
                            >
                            <path 
                                d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 
                                2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"
                            />
                            <path 
                                d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 
                                6-12-12 .708-.708 12 12-.708.708z"
                            />
                            </svg>
                        }
                        </div>
                    }
                    <input 
                        type='submit' 
                        id='submit-button' 
                        value={isLogIn ? 'Log In' : 'Sign Up'} 
                        onClick={(e) => handleSubmit(e, isLogIn ? 'login' : 'signup')}
                        className={quicksand700.className}
                    />
                    {error && 
                        <p className='error'>{error}</p>
                    }
                </form>
                {isLogIn && 
                <p className={quicksand.className} id='letters'>Not member yet?
                    <a 
                    onClick={() => handleClean(false)}
                    className={quicksand700.className}
                    >
                        Sign up now!
                    </a>
                </p>
                }
                {!isLogIn && 
                <p className={quicksand.className} id='letters'>Are you a member? 
                    <a 
                        onClick={() => handleClean(true)}
                        className={quicksand700.className}
                    >
                    Log in!
                    </a>
                </p>
                }
            </div>
            )}
        </div>
    )
}

export default Access;