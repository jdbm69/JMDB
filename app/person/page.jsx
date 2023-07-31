'use client'
import { useState, useEffect } from 'react';
import { quicksand700, roboto } from '@/public/fonts';
import { miniArrowLeft, miniArrowRght } from '@/public/icons';
import Link from 'next/link';
import { LoadingPage } from '../components/LoadingPage';

const Person = () => {
    const [persons, setPersonss] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const fetchPersons = async (page = 1) => {
        setIsLoading(true);
        try {
        let apiUrl = `https://api.themoviedb.org/3/person/popular?api_key=${process.env.NEXT_PUBLIC_TOKEN}&page=${page}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        setPersonss(data.results);
        setTotalPages(data.total_pages);
        } catch (error) {
        console.error('Error fetching persons:', error);
        } finally {
        setIsLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchPersons(page);
    };

    useEffect(() => {
        fetchPersons();
    }, []);

    return (
        <div className='person-cont'>
            <div className='persons-list'>
                {isLoading ? (
                    <LoadingPage />
                ) : (
                    persons?.map((person) => 
                        <Link href={`/person/${person.id}`} key={person.id}>
                            <div key={person.id} className="cast-item">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500/${person.profile_path}`}
                                    alt={person.name}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/profile.jpg';
                                    }}
                                />
                                <div className="person-info">
                                    <h3 className={roboto.className}>{person.name}</h3>
                                    <h4 className={quicksand700.className}>{person.known_for_department}</h4>
                                </div>
                            </div>
                        </Link>
                    )
                )}
            </div>
            <div className='pagination'>
                {currentPage > 1 && (
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={quicksand700.className}
                    >
                        {miniArrowLeft}
                        Prev
                    </button>
                )}
                <span className={quicksand700.className}>{currentPage}</span>
                {currentPage < totalPages && (
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={quicksand700.className}
                    >
                        Next
                        {miniArrowRght}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Person;