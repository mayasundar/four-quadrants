import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import {useState, useEffect} from "react";

export default function JoinRoom({socket}) {
    const router = useRouter();
    const [name, setName] = useState('');
    const [roomCode, setRoomCode] = useState('');

    useEffect(()=>{
        if(router.query.room){
            setRoomCode(router.query.room);
        }

    },[router.query.room]);

    const handleSubmit = (name, room, option) => {
        if (!name || name.trim()==='') {
            alert("Please enter your name");
            return;
        }
        if (option === 'join' && (!room || room.trim()==='')) {
            alert("Please enter a room code");
            return;
        }
        const sendRoomCode = option === 'create'
            ? Math.random().toString(36).substring(2, 8)
            : room;

        socket.emit('join-room', {room:sendRoomCode, name});
        router.push(`/${sendRoomCode}`);
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
          <button type="submit" onClick={(e)=>handleSubmit(name, null, 'create')}>Create Room</button>

          <p>or</p>

          {/*join existing room*/}
          <label htmlFor="roomName">Enter room code</label>
        <input id="roomName" type="text" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} disabled={router.query.room !== undefined}/>
          <br></br>

          <button type="submit" onClick={(e)=>handleSubmit(name, roomCode, 'join')}>Join Room</button>
      </form>
    </div>
  );
}