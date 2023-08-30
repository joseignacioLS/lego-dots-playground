import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./Canvas.module.scss";
import { angles, square } from "../data/dots";
import {
  calculateGap,
  coordsToPosition,
  positionToCoords,
} from "../utils/space";
import {
  cleanCanvas,
  drawImageOnCanvas,
  drawOnCanvas,
  getDrawnSize,
} from "../utils/canvas";
import { CanvasContext } from "../context/canvas";
import { MouseContext } from "../context/mouse";

const highRes = 64;

const Canvas = ({}) => {
  const canvasref = useRef();
  const [ctx, setCtx] = useState(undefined);

  const {
    template,
    dots,
    dotSize,
    placeDot,
    color,
    rotation,
    printMode,
    selectedDots,
    toggleSelected,
    checkCollisions,
  } = useContext(CanvasContext);

  const { mousePosition, updateMousePosition } = useContext(MouseContext);

  const [canvasSize, setCanvasSize] = useState(2014);
  const [isCollision, setIsCollision] = useState(-1);
  const [drawnSize, setDrawnSize] = useState([8, 8]);
  const [images, setImages] = useState([]);

  const handleClick = () => {
    if (!mousePosition) return;
    if (isCollision === -1 && !template) {
      const position = coordsToPosition(...mousePosition, dotSize);
      const index = checkCollisions({
        position,
        collision: [[1]],
      });
      toggleSelected(index);
    }
    if (template) {
      const position = coordsToPosition(...mousePosition, dotSize);
      placeDot({
        dot: template,
        position,
        color,
        rotation,
      });
    }
  };

  const handleOver = (e) => {
    updateMousePosition(e, canvasref, dotSize);
  };

  const updateCanvas = () => {
    if (!ctx) return;
    cleanCanvas(ctx);

    const highResSize = [
      (highRes + calculateGap(highRes)) * (drawnSize.maxX - drawnSize.minX + 3),
      (highRes + calculateGap(highRes)) * (drawnSize.maxY - drawnSize.minY + 3),
    ];

    if (printMode) {
      drawImageOnCanvas(
        ctx,
        images[0],
        [0, 0],
        [images[0].width, images[0].height],
        [0, 0],
        highResSize
      );
    }
    if (!printMode) {
      drawGrid();
    }
    if (printMode) {
      ctx.filter = "blur(1px)";
    }
    drawDots(
      printMode ? highRes : dotSize,
      printMode ? [drawnSize.minX, drawnSize.minY] : undefined
    );
    ctx.filter = "none";
    if (printMode) {
      drawImageOnCanvas(
        ctx,
        images[1],
        [0, 0],
        [images[1].width, images[1].height],
        [0, 0],
        highResSize,
        0.8,
        "color-burn"
      );
    }
  };

  const drawGrid = () => {
    const gap = calculateGap(dotSize);
    for (let i = 0; i < Math.round(canvasSize / dotSize); i++) {
      for (let j = 0; j < Math.round(canvasSize / dotSize); j++) {
        const x = j * (dotSize + gap);
        const y = i * (dotSize + gap);
        drawOnCanvas(ctx, [x, y], square, 0, "#DDD", dotSize);
      }
    }
  };

  const drawDots = (dotSize, margin = undefined) => {
    dots.forEach((dot, i) => {
      drawOnCanvas(
        ctx,
        positionToCoords(...dot.position, dotSize),
        dot.dot,
        angles[dot.rotation],
        selectedDots.includes(i) && !printMode ? "#FF0" : dot.color,
        dotSize,
        margin
      );
    });
  };

  const resizeListener = () => {
    const width = canvasref.current.getBoundingClientRect().width;
    setCanvasSize(width);
  };

  useEffect(() => {
    setImages(
      ["/paper.jpg", "print.jpg"].map((img) => {
        const dom = document.createElement("img");
        dom.src = img;
        return dom;
      })
    );
    const ctxRef = canvasref.current.getContext("2d");
    setCtx(ctxRef);
    const width = canvasref.current.getBoundingClientRect().width;
    setCanvasSize(width);
    window.addEventListener("resize", resizeListener);
    return () => window.removeEventListener("resize", resizeListener);
  }, []);

  useEffect(() => {
    if (!ctx) return;
    updateCanvas();
  }, [ctx, canvasSize, drawnSize, dotSize, dots]);

  useEffect(() => {
    if (template) toggleSelected(undefined);
    if (!template) setIsCollision(-1);
  }, [template]);

  useEffect(() => {
    if (printMode) setDrawnSize(getDrawnSize(dots));
    if (!ctx || !mousePosition || printMode) return;
    updateCanvas();
    if (!template) return;
    const index = checkCollisions({
      position: coordsToPosition(...mousePosition, dotSize),
      collision: template.collision[rotation],
    });
    setIsCollision(index);
    drawOnCanvas(
      ctx,
      mousePosition,
      template,
      angles[rotation],
      isCollision > -1 ? "#F00" : color,
      dotSize
    );
  }, [mousePosition, template, color, rotation, printMode, selectedDots]);

  return (
    <canvas
      width={
        !printMode
          ? canvasSize
          : (highRes + calculateGap(highRes)) *
            (drawnSize.maxX - drawnSize.minX + 3)
      }
      height={
        !printMode
          ? canvasSize
          : (highRes + calculateGap(highRes)) *
            (drawnSize.maxY - drawnSize.minY + 3)
      }
      ref={canvasref}
      className={styles.canvas}
      onClick={handleClick}
      onMouseMove={handleOver}
    ></canvas>
  );
};

export default Canvas;
