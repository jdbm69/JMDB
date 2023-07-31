import { Navigation } from './components/Navigation'
import '../styles/index.scss'
import 'animate.css';

export const metadata = {
  title: 'JMovie Data Base (JMDB)',
  description: 'Find your favorites movies',
}

export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
        />
      </head>
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
