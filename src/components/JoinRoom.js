import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import {useState} from "react";

export default function JoinRoom({socket}) {
    const router = useRouter();
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    const handleSubmit = (name, room, option) => {
        if (!name) {
            alert("Please enter your name");
            return;
        }
        socket.emit('join-room', {room, name});

        const path = option === 'create' ? `/${room}` : `/${room}`;
        router.push(path);
    };

  return (
    <div>
      <h1>Join Room</h1>
      <form className={styles.form} onSubmit={(e)=>e.preventDefault()}>
          {/*required regardless*/}
          <label htmlFor="name">Enter your name</label>
          <input id="name" type="text" value={name} required onChange={(e)=>setName(e.target.value)}/>
          <br></br>

          {/*create new room*/}
          <br></br>
          <button type="submit" onClick={(e)=>handleSubmit(name,Math.random().toString(36).substring(2, 8), 'create')}>Create Room</button>
          <p>or</p>

          {/*join existing room*/}
          <label htmlFor="roomName">Enter room code</label>
        <input id="roomName" type="text" onChange={(e) => setRoom(e.target.value)}/>
          <br></br>

          <button type="submit" onClick={(e)=>handleSubmit(name, room, 'join')}>Join Room</button>
      </form>
    </div>
  );
}