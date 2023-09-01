import React, { useEffect, useRef } from "react";
import { drawOnCanvas } from "../../utils/canvas";

const Miniature = ({ template, color, size = 32, w = 1, h = 1 }) => {
  const canvasref = useRef();

  useEffect(() => {
    const ctx = canvasref.current.getContext("2d");
    drawOnCanvas(ctx, [0, 0], template, 0, color, size);
  }, [template, color]);
  return <canvas ref={canvasref} width={size * w} height={size * h}></canvas>;
};

export default Miniature;
