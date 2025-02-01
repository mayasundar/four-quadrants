import React, {useCallback, useRef, useState} from 'react';
import Draggable from 'react-draggable';
import styles from '../styles/Home.module.css';

const Label = ({ x, y, value, onDelete, onDragStop, onUpdateText, id }) => {
    const nodeRef = useRef(null);
    const [hoveredLabel, setHoveredLabel] = useState(null);

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
                 onMouseEnter={() => setHoveredLabel(id)}
                 onMouseLeave={() => setHoveredLabel(null)}
            >
                <div className={styles.draggy}>

                    {(hoveredLabel === id) && (
                        <button
                            className={styles.deleteButton}
                            onClick={() => onDelete(id)}
                        >
                            x
                        </button>
                    )}

                </div>

                <textarea
                    value={value}
                    onChange={handleTextChange}
                    className={styles.labelInput}
                    autoFocus={true}
                    placeholder={"Enter text"}
                    draggable="false"
                    autoCapitalize={"none"}
                    autoCorrect={"off"}
                />
            </div>
        </Draggable>
    );
};

export default React.memo(Label);
