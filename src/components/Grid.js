import React, {useRef, useCallback, useEffect, useMemo, useState} from "react";
import styles from "@/styles/Home.module.css";

const Grid = ({ }) => {
    const canvasRef = useRef(null);
    const size = 600;
    const scale = useMemo(() => (typeof window !== "undefined" ? window.devicePixelRatio : 1), []);
    const s = 300;

    const gridConstants = useMemo(() => {
        const nX = Math.floor(size / s);
        const nY = Math.floor(size / s);
        const pX = size - nX * s;
        const pY = size - nY * s;
        return {
            nX,
            nY,
            pL: Math.ceil(pX / 2) - 0.5,
            pT: Math.ceil(pY / 2) - 0.5,
            pR: size - nX * s - Math.ceil(pX / 2) + 0.5,
            pB: size - nY * s - Math.ceil(pY / 2) + 0.5,
        };
    }, [size, s]);

    const { pL, pT, pR, pB } = gridConstants;

    const drawGrid = useCallback((ctx) => {
        ctx.strokeStyle = 'lightgrey';
        ctx.beginPath();
        for (let x = pL; x <= size - pR; x += s) {
            ctx.moveTo(x, pT);
            ctx.lineTo(x, size - pB);
        }
        for (let y = pT; y <= size - pB; y += s) {
            ctx.moveTo(pL, y);
            ctx.lineTo(size - pR, y);
        }
        ctx.stroke();
    }, [size, pL, pR, pT, pB, s]);

    const drawAxes = useCallback((ctx) => {
        ctx.strokeStyle = 'lightgrey';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        const centerX = Math.round(gridConstants.nX / 2) * s + pL;
        const centerY = Math.round(gridConstants.nY / 2) * s + pT;
        ctx.moveTo(pL, centerY);
        ctx.lineTo(size - pR, centerY);
        ctx.moveTo(centerX, pT);
        ctx.lineTo(centerX, size - pB);
        ctx.stroke();
    }, [size, pL, pR, pT, pB, s, gridConstants]);


    const redrawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(scale, scale);
        ctx.translate(0.5, 0.5);
        ctx.lineWidth = 0.5;

        drawGrid(ctx);
        drawAxes(ctx);

        ctx.restore();
    }, [drawGrid, drawAxes, scale]);


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
        canvas.width = size * scale;
        canvas.height = size * scale;

        redrawCanvas();

    }, [size, scale, redrawCanvas]);


    return <canvas ref={canvasRef} />;
};

export default Grid;
