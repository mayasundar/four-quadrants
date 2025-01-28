import React, { useState, useRef } from "react";
import Draggable from "react-draggable";
import { Resizable } from "re-resizable";
import styles from "@/styles/Home.module.css";

const ImageUpload = ({ onImagePositionUpdate }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [size, setSize] = useState({ width: 100, height: '180' });
    const imageRef = useRef(null);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const handleResize = (e, { size }) => {
        setSize(size);
    };

    return (
        <div className={styles.imageUpload}>
            <label htmlFor="file-upload" className="custom-file-upload">
                Custom Upload ⇧
            </label>
            <input id="file-upload" type="file" className={styles.upload} name="myImage" onChange={handleFileUpload} />

            {selectedImage && (
                <div>
                    <Draggable
                        position={position}
                        onDrag={(e, data) => {
                            setPosition({ x: data.x, y: data.y });
                            onImagePositionUpdate({ x: data.x, y: data.y });
                        }}
                        nodeRef={imageRef}
                    >
                        <div
                            ref={imageRef}
                            style={{
                                display: "inline-block",
                                cursor: "grab",
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault();

                                imageRef.current.style.cursor = "grabbing";
                            }}
                            onMouseUp={() => {
                                imageRef.current.style.cursor = "grab";
                            }}
                            className={styles.uploadedImage}
                        >
                            <button onClick={() => setSelectedImage(null)}>x</button>

                            <Resizable
                                size={size}
                                lockAspectRatio={true}
                                onResizeStop={handleResize}
                            >
                                <img className={styles.nondrag}
                                    alt="Uploaded"
                                    src={URL.createObjectURL(selectedImage)}
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        objectFit: "contain",
                                    }}
                                />
                            </Resizable>
                        </div>
                    </Draggable>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
