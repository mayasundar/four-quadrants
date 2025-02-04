import head from 'next/head';
import styles from '@/styles/Home.module.css';
import JoinRoom from '../components/JoinRoom';
import {useState} from 'react';
import Grid from '../components/Grid';

export default function Home({socket}) {
  return (
      <div className={styles.container}>
    <div className={styles.index}>

        <div className={styles.form}>
            <JoinRoom socket={socket}/>

            <div className={styles.grid}>
                <Grid></Grid>
            </div>

        </div>
    </div>
      </div>
  );
}