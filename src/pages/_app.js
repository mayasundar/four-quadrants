import "@/styles/globals.css";
import {Overpass_Mono} from 'next/font/google';
import {io} from 'socket.io-client';
import {useEffect, useState} from "react";

const overpass = Overpass_Mono({ subsets: ['latin'] })

export default function App({ Component, pageProps }) {
    const [socket, setSocket] = useState(null);

    useEffect(()=>{
        const socket = io({path: "/api/socket"});
        setSocket(socket);
        socket.on("connect",()=>{
            console.log("Connected to Socket.IO:", socket.id);
        });
        return () => {
            socket.disconnect();
        };
    }, []);

  return (
      <div className={`${overpass.className}`}>
        <Component {...pageProps} socket={socket} />;
      </div>
    );
}
