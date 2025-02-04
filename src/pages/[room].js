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

    //TODO: set up cursor / mouse coordinates

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
    useEffect(() => {
        if (socket && roomCode){
            // display players in the room
            socket.emit('get-players', roomCode);
            socket.on('update-players', setPlayers);
            // listen for circle updates
            socket.on("add-circle", ({ circles }) => {
                setCircles(circles);
            });
            socket.on("delete-circle", ({ id }) => {
                setCircles((prevCircles) => prevCircles.filter(circle => circle.id !== id));
            });
            socket.on("update-circle", ({ id, newX, newY }) => {
                setCircles((prevCircles) =>
                    prevCircles.map(circle =>
                        circle.id === id ? { ...circle, labelX: newX, labelY: newY } : circle
                    )
                );
            });
            socket.on("update-circle-text", ({ id, newText }) => {
                setCircles((prevCircles) =>
                    prevCircles.map(circle =>
                        circle.id === id ? { ...circle, text: newText } : circle
                    )
                );
            });

            socket.on("update-axis-labels", ({ top, left, right, bottom }) => {
                setAxisLabels({ top, left, right, bottom });
            });

            return () => {
                socket.off('update-players');
                socket.off('player-joined');
                socket.off('add-circle');
                socket.off('delete-circle');
                socket.off('update-circle');
                socket.off('update-circle-text');
                socket.off('update-axis-labels');
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
      // const adjustedCircle = adjustPositionForOverlap(newCircle);
      setCircles((prevCircles) => {
          const updatedCircles= [...prevCircles, { ...newCircle, id: Date.now().toString(), text: "" }];
        socket.emit("add-circle", { roomCode, circles: updatedCircles });
        return updatedCircles;
      });
  }, []);

  const deleteCircle = useCallback((id) => {
    setCircles((prevCircles) => {
        const updatedCircles = prevCircles.filter((circle) => circle.id !== id);
        socket.emit("delete-circle", { roomCode, id });
        return updatedCircles;
    });
  }, []);

  const updateCircle = useCallback((id, newX, newY) => {
    setCircles((prevCircles) => {
        const updatedCircles = prevCircles.map((circle) =>
            circle.id === id ? {...circle, labelX: newX, labelY: newY} : circle
        );
        socket.emit("update-circle", { roomCode, id, newX, newY});
        return updatedCircles;
    });
  }, []);

  const updateCircleText = useCallback((id, newText) => {
    setCircles((prevCircles) => {
        const updatedCircleText = prevCircles.map((circle) =>
            circle.id === id ? {...circle, text: newText} : circle
        );
        socket.emit("update-circle-text", { roomCode, id, newText });
        return updatedCircleText;
    });
  }, []);

  const [axisLabels, setAxisLabels] = useState({top: "", left: "", right: "", bottom: ""});

  const updateAxisLabel = useCallback((axis, text) => {
      setAxisLabels((prev) => ({ ...prev, [axis]: text }));
      socket.emit("update-axis-labels", {
          roomCode,
          [axis]: text
      });
  }, []);

    // const adjustPositionForOverlap = (newCircle) => {
    //     let adjustedX = newCircle.labelX;
    //     let adjustedY = newCircle.labelY;
    //
    //     circles.forEach((circle) => {
    //         while (isOverlapping(adjustedX, adjustedY, circle.labelX, circle.labelY)) {
    //             adjustedX += 20;
    //             adjustedY += 20;
    //         }
    //     });
    //     return { ...newCircle, labelX: adjustedX, labelY: adjustedY };
    // };
    //
    // const isOverlapping = (x1, y1, x2, y2) => {
    //     const labelWidth = 150;
    //     const labelHeight = 80;
    //     return !(x1 + labelWidth < x2 || x1 > x2 + labelWidth || y1 + labelHeight < y2 || y1 > y2 + labelHeight);
    // };

    return (
        <>
            <Head>
                <title>Four Quadrants</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.room}>
            <main className={styles.main}>
                <div className={styles.sidebar}>
                    <div>
                        <h3>Users</h3>
                        <p>
                            {players.map((player, index) => (
                                <p key={index}>{player.name}</p>
                            ))}
                        </p>
                    </div>

                    <div>
                        <h3>Tools</h3>
                        {/*<ul>*/}
                        {/*    <li>share</li>*/}
                        {/*    <li>save</li>*/}
                        {/*</ul>*/}

                        <ImageUpload
                            socket={socket}
                            roomCode={roomCode}
                            onImageUpload={handleImageUpload}
                            onImagePositionUpdate={handleImagePositionUpdate}
                            className={styles.imageUpload}
                        />

                    </div>
                </div>

                <div className={styles.canvasWrapper}>
                    <div className={styles.axesContainer}>

                        <input
                            type="text"
                            className={styles.axisLabel}
                            style={{
                                position: "absolute",
                                left: "50%",
                                top: "-45px",
                                transform: "translateX(-50%)",
                            }}
                            placeholder="Enter Text"
                            value={axisLabels.top}
                            onChange={(e) => updateAxisLabel("top", e.target.value)}
                        />
                        <input
                            type="text"
                            className={styles.axisLabel}
                            style={{
                                position: "absolute",
                                left: "-140px",
                                top: "50%",
                                transform: "rotate(-90deg) translateY(-50%)",
                            }}
                            placeholder="Enter Text"
                            value={axisLabels.left}
                            onChange={(e) => updateAxisLabel("left", e.target.value)}
                        />
                        <input
                            type="text"
                            className={styles.axisLabel}
                            style={{
                                position: "absolute",
                                right: "-140px",
                                top: "50%",
                                transform: "rotate(90deg) translateY(-50%)",
                            }}
                            placeholder="Enter Text"
                            value={axisLabels.right}
                            onChange={(e) => updateAxisLabel("right", e.target.value)}

                        />
                        <input
                            type="text"
                            className={styles.axisLabel}
                            style={{
                                position: "absolute",
                                left: "50%",
                                bottom: "-45px",
                                transform: "translateX(-50%)",
                            }}
                            placeholder="Enter Text"
                            value={axisLabels.bottom}
                            onChange={(e) => updateAxisLabel("bottom", e.target.value)}
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
            </div>
        </>
    );
}