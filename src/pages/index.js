import head from 'next/head';
import styles from '@/styles/Home.module.css';
import JoinRoom from '../components/JoinRoom';
import {useState} from 'react';

export default function Home({socket}) {
  return (
    <div>
        <JoinRoom socket={socket}/>
    </div>
  );
}