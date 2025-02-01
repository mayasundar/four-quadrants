import Head from "next/head";
import styles from "@/styles/Home.module.css";
import {useState, useCallback, useEffect } from "react";
import Label from '../components/Label.js';
import Canvas from '../components/Canvas.js';
import ImageUpload from "../components/ImageUpload.js";
import { useRouter } from "next/router";

export default function Room({socket}) {
    const router = useRouter();
    const roomCode = router.query.room;
    const [imagePositions, setImagePositions] = useState({});
    const [uploadedImage, setUploadedImage] = useState(null);
    const [circles, setCircles] = useState([]);
    const [players, setPlayers] = useState([]);
    // TODO: once DB is set up, fetch existing data for this room
    // useEffect(() => {
    //     fetch(`/api/rooms/${roomCode}`)
//         .then((res) => res.json())
//         .then((data) => {
//             setCircles(data.circles);
//             setUploadedImage(data.image);
//             setImagePosition(data.imagePosition);
//         });
// }, [roomCode]);
    // check if socket.id has a name, redirect to home
    useEffect(() => {
        if (socket && roomCode) {
            socket.emit('check-name', roomCode);
            socket.on('redirect-name', (room) => {
                router.push(`/?room=${room}`);
            });
            return () => {
                socket.off('redirect-name');
            };
        }
    }, [socket, roomCode]);
    // display players in the room
    useEffect(() => {
        if (socket && roomCode){
            socket.emit('get-players', roomCode);
            socket.on('update-players', setPlayers);
            return () => {
                socket.off('update-players');
                socket.off('player-joined');
            };
        }
    }, [socket, roomCode]);

    const handleImageUpload = (file) => {
        setUploadedImage(URL.createObjectURL(file));
    };

    const handleImagePositionUpdate = (imageId, position) => {
        setImagePositions(prev=>({...prev, [imageId]: position}));
    };

  const addCircle = useCallback((newCircle) => {
      const adjustedCircle = adjustPositionForOverlap(newCircle);
      setCircles((prevCircles) => [...prevCircles, { ...adjustedCircle, text: "" }]);
  }, []);

  const deleteCircle = useCallback((id) => {
    setCircles((prevCircles) => prevCircles.filter((circle) => circle.id !== id));
  }, []);

  const updateCircle = useCallback((id, newX, newY) => {
    setCircles((prevCircles) =>
        prevCircles.map((circle) =>
            circle.id === id ? { ...circle, labelX: newX, labelY: newY } : circle
        )
    );
  }, []);

  const updateCircleText = useCallback((id, newText) => {
    setCircles((prevCircles) =>
        prevCircles.map((circle) =>
            circle.id === id ? { ...circle, text: newText } : circle
        )
    );
  }, []);
    const adjustPositionForOverlap = (newCircle) => {
        let adjustedX = newCircle.labelX;
        let adjustedY = newCircle.labelY;

        circles.forEach((circle) => {
            while (isOverlapping(adjustedX, adjustedY, circle.labelX, circle.labelY)) {
                adjustedX += 20;
                adjustedY += 20;
            }
        });
        return { ...newCircle, labelX: adjustedX, labelY: adjustedY };
    };

    const isOverlapping = (x1, y1, x2, y2) => {
        const labelWidth = 150;
        const labelHeight = 80;
        return !(x1 + labelWidth < x2 || x1 > x2 + labelWidth || y1 + labelHeight < y2 || y1 > y2 + labelHeight);
    };

    return (
        <>
            <Head>
                <title>Four Quadrants</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div className={styles.sidebar}>
                    <h2>Players</h2>
                    <p>
                        {players.map((player, index) => (
                            <p key={index}>{player.name}</p>
                        ))}
                    </p>
                </div>
                <div className={styles.tools}>
                    <ul>
                        <li>share</li>
                        <li>save</li>
                    </ul>

                    <ImageUpload
                        onImageUpload={handleImageUpload}
                        onImagePositionUpdate={handleImagePositionUpdate}
                        className={styles.imageUpload}
                    />
                </div>
                <div className={styles.canvasWrapper}>
                    <div className={styles.axesContainer}>

                        <input
                            type="text"
                            className={styles.axisLabel}
                            style={{
                                position: "absolute",
                                left: "50%",
                                top: "-40px",
                                transform: "translateX(-50%)",
                            }}
                            placeholder="Enter Text"
                        />
                        <input
                            type="text"
                            className={styles.axisLabel}
                            style={{
                                position: "absolute",
                                left: "-90px",
                                top: "50%",
                                transform: "rotate(-90deg) translateY(-50%)",
                            }}
                            placeholder="Enter Text"
                        />
                        <input
                            type="text"
                            className={styles.axisLabel}
                            style={{
                                position: "absolute",
                                right: "-90px",
                                top: "50%",
                                transform: "rotate(90deg) translateY(-50%)",
                            }}
                            placeholder="Enter Text"
                        />
                        <input
                            type="text"
                            className={styles.axisLabel}
                            style={{
                                position: "absolute",
                                left: "50%",
                                bottom: "-40px",
                                transform: "translateX(-50%)",
                            }}
                            placeholder="Enter Text"
                        />
                    </div>

                    <Canvas
                        circles={circles}
                        onAddCircle={addCircle}
                        onDeleteCircle={deleteCircle}
                        onUpdateCircle={updateCircle}
                    />

                    <div style={{ position: "absolute", top: 0, left: 0 }}>
                        {circles.map((circle) => {
                            const adjustedX = circle.labelX > 450 ? circle.labelX - 150 : circle.labelX;
                            return(
                            <Label
                                key={circle.id}
                                id={circle.id}
                                x={adjustedX}
                                y={circle.labelY}
                                value={circle.text}
                                onUpdateText={updateCircleText}
                                onDelete={() => deleteCircle(circle.id)}
                                onDragStop={updateCircle}
                            />
                            );
                        })}
                    </div>
                </div>
            </main>
        </>
    );
}