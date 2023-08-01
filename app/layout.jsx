import { Navigation } from './components/Navigation'
import '../styles/index.scss'
import 'animate.css';

export const metadata = {
  title: 'JMovie Data Base (JMDB)',
  description: 'Find your favorites movies',
  icons: {
    icon: '/favicon.ico',
  }
}

export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
