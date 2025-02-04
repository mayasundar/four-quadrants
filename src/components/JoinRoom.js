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
      <form className={styles.form} onSubmit={(e)=>e.preventDefault()}>
          {/*required regardless*/}
          <div className={styles.joinRoomContainer}>
              <div className={styles.q1}>
                  <div className={styles.stack}>
                      <p>Four Quadrants</p>
                      <a className={styles.maya} href="https://www.mayasundar.com" target="_blank" rel="noopener noreferrer">
                          by Maya Sundar</a>
                  </div>
              </div>


              <div className={styles.q2}>
                  <div className={styles.stack}>
                  <p>Enter Name</p>
                    <input id="name" type="text" placeholder={"Enter Your Name"} value={name} required onChange={(e)=>setName(e.target.value)}/>
                  </div>
          </div>


          <div className={styles.q3}>
              <div className={styles.stack}>

              <p>Create Room</p>

              <button type="submit" className={styles.btn} onClick={(e)=>handleSubmit(name, null, 'create')}>Create Room</button>
              </div>
          </div>

          <div className={styles.q4}>
              <div className={styles.stack}>
              <p>Join Room</p>

              <input id="roomName" type="text" placeholder={"Enter Room Code"} value={roomCode} onChange={(e) => setRoomCode(e.target.value)} disabled={router.query.room !== undefined}/>
              <button className={styles.btn} type="submit" onClick={(e)=>handleSubmit(name, roomCode, 'join')}>Join Room</button>
              </div>
          </div>


          {/*    /!*create new room*!/*/}
          {/*    <label htmlFor={"roomName"}>Create Room:</label>*/}
          {/*      <button type="submit" onClick={(e)=>handleSubmit(name, null, 'create')}>Create Room</button>*/}
          {/*<p>or</p>*/}

          {/*/!*join existing room*!/*/}
          {/*        <label htmlFor="roomName">Room Code:</label>*/}
          {/*          <input id="roomName" type="text" placeholder={"Enter Room Code"} value={roomCode} onChange={(e) => setRoomCode(e.target.value)} disabled={router.query.room !== undefined}/>*/}
          {/*        <button type="submit" onClick={(e)=>handleSubmit(name, roomCode, 'join')}>Join Room</button>*/}
          </div>

      </form>
    </div>
  );
}