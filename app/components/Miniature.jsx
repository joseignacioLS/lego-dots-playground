import React, { useEffect, useRef } from "react";
import { drawOnCanvas } from "../utils/canvas";

const Miniature = ({ template, color, size, w, h }) => {
  const canvasref = useRef();

  useEffect(() => {
    const ctx = canvasref.current.getContext("2d");
    drawOnCanvas(ctx, [0, 0], template, 0, color, size);
  }, [template, color]);
  return <canvas ref={canvasref} width={size * w} height={size * h}></canvas>;
};

export default Miniature;
