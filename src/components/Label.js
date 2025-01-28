import React, { useCallback, useRef } from 'react';
import Draggable from 'react-draggable';

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
        >
            <div className="draggable-input" ref={nodeRef} style={{ position: 'absolute' }}>
                <input type="text"
                       value={value}
                       onChange={handleTextChange}
                />
                <button onClick={() => onDelete(id)}>x</button>
            </div>
        </Draggable>
    );
};

export default React.memo(Label);
