import "@/styles/globals.css";
import {Overpass_Mono} from 'next/font/google';

const overpass = Overpass_Mono({ subsets: ['latin'] })



export default function App({ Component, pageProps }) {
  return (
      <div className={`${overpass.className}`}>
      <Component {...pageProps} />;
      </div>
)
}
