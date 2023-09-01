import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./Canvas.module.scss";
import { angles, square } from "../data/dots";
import {
  calculateGap,
  coordsToPosition,
  positionToCoords,
} from "../utils/space";
import { cleanCanvas, drawImageOnCanvas, drawOnCanvas } from "../utils/canvas";
import { CanvasContext } from "../context/canvas";
import { MouseContext } from "../context/mouse";

const canvasBaseSize = 2048;

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
    limits,
    dragSelect,
  } = useContext(CanvasContext);

  const {
    mousePosition,
    updateMousePosition,
    mouseDrag,
    setDragOrigin,
    cleanDrag,
  } = useContext(MouseContext);

  const [canvasSize, setCanvasSize] = useState([
    canvasBaseSize,
    canvasBaseSize,
  ]);
  const [isCollision, setIsCollision] = useState([]);
  const [images, setImages] = useState([]);

  const handleClick = () => {
    if (!mousePosition) return;
    if (mouseDrag[1]) {
      const md0 = coordsToPosition(...mouseDrag[0], dotSize);
      const md1 = coordsToPosition(...mouseDrag[1], dotSize);
      if (md0[0] !== md1[0] || md0[1] !== md1[1]) return;
    }
    if (!template) {
      const position = coordsToPosition(...mousePosition, dotSize);
      const collisions = checkCollisions({
        position,
        collision: [[1]],
      });
      toggleSelected(collisions);
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

  const calculateHighResSize = () => {
    const columns = limits.maxX - limits.minX + 1;
    const rows = limits.maxY - limits.minY + 1;
    const res = printMode ? canvasBaseSize / Math.max(columns, rows) : dotSize;

    const highResSize = [
      (res + calculateGap(res)) * columns,
      (res + calculateGap(res)) * rows,
    ];
    return { highResSize, res, columns, rows };
  };

  const updateCanvas = () => {
    if (!ctx) return;
    cleanCanvas(ctx);

    const { highResSize, res, columns, rows } = calculateHighResSize();

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
    if (printMode && rows < 10 && columns < 10) {
      ctx.filter = `blur(3px)`;
    }
    drawDots(res);
    ctx.filter = "none";
    if (printMode) {
      drawImageOnCanvas(
        ctx,
        images[1],
        [0, 0],
        [images[1].width, images[1].height],
        [0, 0],
        highResSize,
        1,
        "color-burn"
      );
    }
  };

  const drawGrid = () => {
    const gap = calculateGap(dotSize);
    for (let i = limits.minY; i <= limits.maxY; i++) {
      for (let j = limits.minX; j <= limits.maxX; j++) {
        const x = j * (dotSize + gap);
        const y = i * (dotSize + gap);
        drawOnCanvas(ctx, [x, y], square, 0, "#DDD", dotSize);
      }
    }
  };

  const drawDots = (res) => {
    dots.forEach((dot, i) => {
      if (printMode && dot.position[0] - dot.dot.size[0] > limits.maxX) return;
      if (printMode && dot.position[1] - dot.dot.size[1] > limits.maxY) return;
      drawOnCanvas(
        ctx,
        positionToCoords(...dot.position, res),
        dot.dot,
        angles[dot.rotation],
        selectedDots.includes(i) && !printMode ? "#FF0" : dot.color,
        res
      );
    });
  };

  const resizeListener = () => {
    const width = Math.floor(canvasref.current.getBoundingClientRect().width);
    setCanvasSize([width, width]);
  };

  useEffect(() => {
    setImages(
      ["/paper2.png", "/print3.png"].map((img) => {
        const dom = document.createElement("img");
        dom.src = img;
        return dom;
      })
    );
    const ctxRef = canvasref.current.getContext("2d");
    setCtx(ctxRef);
    resizeListener();
    window.addEventListener("resize", resizeListener);
    return () => window.removeEventListener("resize", resizeListener);
  }, []);

  useEffect(() => {
    if (!ctx) return;
    updateCanvas();
  }, [ctx, canvasSize, limits, dotSize, dots]);

  useEffect(() => {
    if (template) toggleSelected(undefined);
    if (!template) setIsCollision([]);
  }, [template]);

  useEffect(() => {
    if (printMode) {
      const { highResSize } = calculateHighResSize();
      setCanvasSize(highResSize);
    } else {
      resizeListener();
    }
  }, [printMode]);

  useEffect(() => {
    if (!ctx || !mousePosition) return;

    updateCanvas();

    if (printMode) return;

    if (!template) return;
    const collisions = checkCollisions({
      position: coordsToPosition(...mousePosition, dotSize),
      collision: template.collision[rotation],
    });
    setIsCollision(collisions);

    drawOnCanvas(
      ctx,
      mousePosition,
      template,
      angles[rotation],
      isCollision.length > 0 ? "#F00" : color,
      dotSize
    );
  }, [mousePosition, template, color, rotation, selectedDots, canvasSize]);

  return (
    <canvas
      width={canvasSize[0]}
      height={canvasSize[1]}
      ref={canvasref}
      className={styles.canvas}
      onClick={handleClick}
      onMouseMove={handleOver}
      onMouseDown={setDragOrigin}
      onMouseUp={dragSelect}
      onMouseLeave={cleanDrag}
    ></canvas>
  );
};

export default Canvas;
