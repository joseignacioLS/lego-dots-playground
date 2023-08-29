import React, { useEffect, useRef, useState } from "react";
import styles from "./Canvas.module.scss";
import { angles, square } from "../data/dots";
import {
  calculateGap,
  coordsToPosition,
  positionToCoords,
} from "../utils/space";
import { drawOnCanvas } from "../utils/canvas";

const highRes = 128;

const Canvas = ({
  dotSize = 128,
  template = undefined,
  dots = [],
  addDot,
  removeDot,
  rotation = 0,
  color = "#FF0",
  printMode,
  selectedDots,
  toggleSelected,
}) => {
  const canvasref = useRef();
  const [ctx, setCtx] = useState(undefined);

  const [canvasSize, setCanvasSize] = useState(2014);
  const [mousePosition, setMousePosition] = useState([0, 0]);

  const [isCollision, setIsCollision] = useState(-1);

  const [drawnSize, setDrawnSize] = useState([8, 8]);

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

  const placeDot = (dot) => {
    const index = checkCollisions({
      position: dot.position,
      collision: dot.dot.collision[dot.rotation],
    });
    if (index === Infinity) return;
    if (index > -1) removeDot([index]);
    addDot(dot);
  };

  const handleOver = (e) => {
    const rect = canvasref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const position = coordsToPosition(x, y, dotSize);
    const coords = positionToCoords(...position, dotSize);
    setMousePosition(coords);
  };

  const updateCanvas = () => {
    if (!ctx) return;
    if (printMode) {
      cleanCanvas();
      const image = document.createElement("img");
      image.onload = () => {
        ctx.drawImage(
          image,
          0,
          0,
          1920,
          1280,
          0,
          0,
          (highRes + calculateGap(highRes)) * drawnSize[0],
          (highRes + calculateGap(highRes)) * drawnSize[1]
        );

        ctx.filter = "blur(1px)";
        drawDots(highRes);
        ctx.filter = "none";
        const image2 = document.createElement("img");
        image2.onload = () => {
          ctx.globalAlpha = 0.8;
          ctx.globalCompositeOperation = "color-burn";
          ctx.drawImage(
            image2,
            0,
            0,
            1023,
            683,
            0,
            0,
            (highRes + calculateGap(highRes)) * drawnSize[0],
            (highRes + calculateGap(highRes)) * drawnSize[1]
          );
          ctx.globalAlpha = 1;
          ctx.globalCompositeOperation = "normal";
        };
        image2.src = "/print.jpg";
      };
      image.src = "/paper.jpg";
    } else {
      cleanCanvas();
      drawGrid();
      drawDots(dotSize);
    }
  };

  const cleanCanvas = () => {
    ctx.clearRect(0, 0, 5000, 5000);
  };

  const drawDots = (dotSize) => {
    dots.forEach((dot, i) => {
      drawOnCanvas(
        ctx,
        positionToCoords(...dot.position, dotSize),
        dot.dot,
        angles[dot.rotation],
        selectedDots.includes(i) && !printMode ? "#FF0" : dot.color,
        dotSize
      );
    });
  };

  useEffect(() => {
    if (!ctx) return;
    updateCanvas();
  }, [ctx, canvasSize, dotSize, dots]);

  const resizeListener = () => {
    const width = canvasref.current.getBoundingClientRect().width;
    setCanvasSize(width);
  };

  const getDrawnSize = () => {
    const grid = [...new Array(200)].map((_) =>
      [...new Array(200)].map((_) => 0)
    );
    const limits = {
      minX: Infinity,
      maxX: 0,
      minY: Infinity,
      maxY: 0,
    };
    for (let n = 0; n < dots.length; n++) {
      const dot = dots[n];
      const collisionMatrix = dot.dot.collision[dot.rotation];
      for (let i = 0; i < collisionMatrix.length; i++) {
        for (let j = 0; j < collisionMatrix[i].length; j++) {
          if (collisionMatrix[i][j] === 0) continue;
          const y =
            i + dot.position[1] - Math.floor(collisionMatrix.length / 2);
          const x =
            j + dot.position[0] - Math.floor(collisionMatrix.length / 2);
          if (y < 0 || y >= grid.length || x < 0 || x >= grid.length) continue;
          if (x < limits.minX) limits.minX = x;
          if (x > limits.maxX) limits.maxX = x;
          if (y < limits.minY) limits.minY = y;
          if (y > limits.maxY) limits.maxY = y;
        }
      }
    }
    return [limits.maxX + 2, limits.maxY + 2];
  };

  useEffect(() => {
    const ctxRef = canvasref.current.getContext("2d");
    setCtx(ctxRef);
    const width = canvasref.current.getBoundingClientRect().width;
    setCanvasSize(width);
    window.addEventListener("resize", resizeListener);
    return () => window.removeEventListener("resize", resizeListener);
  }, []);

  const checkCollisions = ({ position, collision }) => {
    const grid = [...new Array(200)].map((_) =>
      [...new Array(200)].map((_) => 0)
    );

    const collisionMatrix = collision;
    for (let i = 0; i < collisionMatrix.length; i++) {
      for (let j = 0; j < collisionMatrix[i].length; j++) {
        if (collisionMatrix[i][j] === 0) continue;
        const y = i + position[1] - Math.floor(collisionMatrix.length / 2);
        const x = j + position[0] - Math.floor(collisionMatrix.length / 2);
        if (y < 0 || y >= grid.length || x < 0 || x >= grid.length)
          return Infinity;
        grid[i + position[1] - Math.floor(collisionMatrix.length / 2)][
          j + position[0] - Math.floor(collisionMatrix.length / 2)
        ] = 1;
      }
    }
    for (let n = 0; n < dots.length; n++) {
      const dot = dots[n];
      const collisionMatrix = dot.dot.collision[dot.rotation];
      for (let i = 0; i < collisionMatrix.length; i++) {
        for (let j = 0; j < collisionMatrix[i].length; j++) {
          if (collisionMatrix[i][j] === 0) continue;
          const y =
            i + dot.position[1] - Math.floor(collisionMatrix.length / 2);
          const x =
            j + dot.position[0] - Math.floor(collisionMatrix.length / 2);
          if (y < 0 || y >= grid.length || x < 0 || x >= grid.length) continue;
          if (grid[y][x] + collisionMatrix[i][j] > 1) {
            return n;
          }
        }
      }
    }
    return -1;
  };

  useEffect(() => {
    if (template) toggleSelected(undefined);
    if (!template) setIsCollision(-1);
  }, [template]);

  useEffect(() => {
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

  useEffect(() => {
    if (printMode) {
      const size = getDrawnSize();
      setDrawnSize(size);
    }
    setTimeout(updateCanvas, 500);
  }, [printMode]);

  return (
    <canvas
      width={
        !printMode
          ? canvasSize
          : (highRes + calculateGap(highRes)) * drawnSize[0]
      }
      height={
        !printMode
          ? canvasSize
          : (highRes + calculateGap(highRes)) * drawnSize[1]
      }
      ref={canvasref}
      className={styles.canvas}
      onClick={handleClick}
      onMouseMove={handleOver}
    ></canvas>
  );
};

export default Canvas;
