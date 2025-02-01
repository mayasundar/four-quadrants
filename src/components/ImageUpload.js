import React, { useState, useRef } from "react";
import Draggable from "react-draggable";
import { Resizable } from "re-resizable";
import styles from "@/styles/Home.module.css";

const ImageUpload = ({ onImagePositionUpdate }) => {
    const [images, setImages] = useState([]);
    const imageRefs = useRef(new Map());
    const [hoveredImage, setHoveredImage] = useState(null);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const id = Date.now();
            imageRefs.current.set(id, React.createRef());
            setImages(prev=>[...prev, {id: id, file, position: {x:0, y:0},size: { width: '50%', height: 'min-content' }
            }]);
        }
    };

    const handleImageDelete = (id) => {
        imageRefs.current.delete(id)
        setImages((prev) => prev.filter((image) => image.id !== id));
    };

    const handleResize = (id, newSize) => {
        setImages(prev => prev.map(img =>
            img.id === id ? { ...img, size:newSize } : img
        ));
    };

    return (
        <div className={styles.imageUpload}>
            <label htmlFor="file-upload" className={styles.customFileUpload}>
                Add Image ⇧
            </label>
            <input id="file-upload" type="file" className={styles.upload} name="myImage" onChange={handleFileUpload} />

            {images.map((image) => (
                    <Draggable
                        className={styles.imgDrag}
                        key={image.id}
                        position={image.position}
                        nodeRef={imageRefs.current.get(image.id)}
                        onDrag={(e, data) => {
                            setImages(prev => prev.map(img =>
                                img.id === image.id
                                    ? { ...img, position: { x: data.x, y: data.y } }
                                    : img
                            ));
                            onImagePositionUpdate(image.id,{ x: data.x, y: data.y });
                        }}
                    >
                        <div
                            ref={imageRefs.current.get(image.id)}
                            style={{
                                position: "absolute", zIndex:1, cursor: "grab",
                            }}
                            onMouseEnter={() => setHoveredImage(image.id)}
                            onMouseLeave={() => setHoveredImage(null)}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                const ref = imageRefs.current.get(image.id);
                                if (ref.current){
                                    ref.current.style.cursor = "grabbing";
                                }
                            }}
                            onMouseUp={() => {
                                const ref = imageRefs.current.get(image.id);
                                if (ref.current){
                                    ref.current.style.cursor = "grab";
                                }
                            }}
                            className={styles.uploadedImage}
                        >
                            {(hoveredImage === image.id) && (
                                <button
                                    className={styles.imgDeleteButton}
                                    onClick={() => handleImageDelete(image.id)}
                                >
                                    x
                                </button>
                            )}
                            <Resizable
                                size={image.size}
                                lockAspectRatio={true}
                                onResizeStop={(e, direction, ref, d) => {
                                    handleResize(image.id, {
                                        width: image.size.width + d.width,
                                        height: image.size.height + d.height
                                    });
                                }}
                            >
                                <img className={styles.nondrag}
                                    alt="Uploaded"
                                    src={URL.createObjectURL(image.file)}
                                    style={{
                                        width: "100%",
                                        height: "min-content",
                                        objectFit: "contain",
                                    }}
                                />
                            </Resizable>
                        </div>
                    </Draggable>
            ))}
        </div>
    );
};

export default ImageUpload;
