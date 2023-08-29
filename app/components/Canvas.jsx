import React, { useEffect, useRef, useState } from "react";
import styles from "./Canvas.module.scss";
import { angles, square } from "../data/dots";
import {
  calculateGap,
  coordsToPosition,
  positionToCoords,
  rotatePoint,
} from "../utils/space";

const drawGrid = (ctx, dotSize, gap, rows, columns) => {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      const x = j * (dotSize + gap);
      const y = i * (dotSize + gap);
      drawOnCanvas(ctx, [x, y], square, 0, "#BBB", dotSize);
    }
  }
};

const drawOnCanvas = (
  ctx,
  startPosition,
  path,
  rotation = 0,
  color = "#000",
  scale = 50
) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  const rotationPoint = [
    startPosition[0] + path.center[0] * scale,
    startPosition[1] + path.center[1] * scale,
  ];
  const rotatedStart = rotatePoint(
    startPosition[0] + path.start[0] * scale,
    startPosition[1] + path.start[1] * scale,
    ...rotationPoint,
    rotation
  );
  ctx.moveTo(...rotatedStart);
  path.paths.forEach((path) => {
    if (path.type === "line") {
      const [x, y] = [
        startPosition[0] + path.coords[0] * scale,
        startPosition[1] + path.coords[1] * scale,
      ];
      const [rX, rY] = rotatePoint(x, y, ...rotationPoint, rotation);
      ctx.lineTo(rX, rY);
    }
    if (path.type === "arc") {
      const [x0, y0] = [
        startPosition[0] + path.coords[0] * scale,
        startPosition[1] + path.coords[1] * scale,
      ];
      const [rX0, rY0] = rotatePoint(x0, y0, ...rotationPoint, rotation);
      const [x1, y1] = [
        startPosition[0] + path.coords[2] * scale,
        startPosition[1] + path.coords[3] * scale,
      ];
      const [rX1, rY1] = rotatePoint(x1, y1, ...rotationPoint, rotation);
      const [x2, y2] = [
        startPosition[0] + path.coords[4] * scale,
        startPosition[1] + path.coords[5] * scale,
      ];
      const [rX2, rY2] = rotatePoint(x2, y2, ...rotationPoint, rotation);
      ctx.bezierCurveTo(rX0, rY0, rX1, rY1, rX2, rY2);
    }
  });
  ctx.fill();
};

const Canvas = ({
  dotSize = 128,
  size = 15,
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
    if (position[0] >= size || position[1] >= size)
      return setMousePosition(undefined);
    setMousePosition(coords);
  };

  const updateCanvas = () => {
    if (!ctx) return;
    if (printMode) {
      cleanCanvas();
      const image = document.createElement("img");
      image.onload = () => {
        ctx.drawImage(image, 0, 0, 1920, 1280, 0, 0, canvasSize, canvasSize);

        ctx.filter = "blur(1px)";
        drawDots();
        ctx.filter = "none";
        const image2 = document.createElement("img");
        image2.onload = () => {
          ctx.globalAlpha = 0.8;
          ctx.globalCompositeOperation = "color-burn";
          ctx.drawImage(image2, 0, 0, 1023, 683, 0, 0, canvasSize, canvasSize);
          ctx.globalAlpha = 1;
          ctx.globalCompositeOperation = "normal";
        };
        image2.src = "/print.jpg";
      };
      image.src = "/paper.jpg";
    } else {
      cleanCanvas();
      initializeGrid();
      drawDots();
    }
  };

  const cleanCanvas = () => {
    ctx.clearRect(0, 0, 5000, 5000);
  };

  const initializeGrid = () => {
    drawGrid(ctx, dotSize, calculateGap(dotSize), size, size);
  };

  const drawDots = () => {
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
  }, [ctx, size, canvasSize, dotSize, dots]);

  const resizeListener = () => {
    const width = canvasref.current.getBoundingClientRect().width;
    setCanvasSize(width);
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
    const grid = [...new Array(size)].map((_) =>
      [...new Array(size)].map((_) => 0)
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
    updateCanvas();
  }, [printMode]);

  return (
    <canvas
      width={
        !printMode ? canvasSize : (dotSize + calculateGap(dotSize)) * size
      }
      height={
        !printMode ? canvasSize : (dotSize + calculateGap(dotSize)) * size
      }
      ref={canvasref}
      className={styles.canvas}
      onClick={handleClick}
      onMouseMove={handleOver}
    ></canvas>
  );
};

export default Canvas;
