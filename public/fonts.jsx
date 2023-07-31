import { Quicksand } from 'next/font/google'
import { Roboto } from 'next/font/google'
import { Raleway } from 'next/font/google'
import { Barlow } from 'next/font/google'
import { Oswald } from 'next/font/google'

export const quicksand = Quicksand({
    subsets: ['latin'],
    weight: '500'
})

export const quicksand700 = Quicksand({
    subsets: ['latin'],
    weight: '700'
});

export const roboto = Roboto({
    subsets: ['latin'],
    weight: '900'
})

export const raleway = Raleway({
    subsets: ['latin'],
    weight: '900'
})

export const barlow = Barlow({
    subsets: ['latin'],
    weight: '900'
})

export const oswald = Oswald({
    subsets: ['latin'],
    weight: '700'
})