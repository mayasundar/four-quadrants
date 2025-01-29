import React, { useCallback, useRef } from 'react';
import Draggable from 'react-draggable';
import styles from '../styles/Home.module.css';

const Label = ({ x, y, value, onDelete, onDragStop, onUpdateText, id }) => {
    const nodeRef = useRef(null);

    const handleDragStop = useCallback(
        (e, data) => {
            onDragStop(id, data.x, data.y);
        },
        [id, onDragStop]
    );
    const handleTextChange = useCallback(
        (e) => {
            const newText = e.target.value;
            onUpdateText(id, newText);
        },
        [id, onUpdateText]
    );

    return (
        <Draggable
            defaultPosition={{ x, y }}
            onStop={handleDragStop}
            nodeRef={nodeRef}
            handle={`.${styles.draggy}`}
        >
            <div ref={nodeRef} className={styles.label}
            >
                <div className={styles.draggy}>

                    <button
                        onClick={() => onDelete(id)}
                        className={styles.deleteButton}>x
                    </button>

                </div>

                <textarea
                    value={value}
                    onChange={handleTextChange}
                    className={styles.labelInput}
                    autoFocus={true}
                    placeholder={"Enter text"}
                    draggable="false"
                />
            </div>
        </Draggable>
    );
};

export default React.memo(Label);
