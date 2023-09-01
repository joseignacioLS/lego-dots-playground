import { rotatePoint } from "./space";

export const cleanCanvas = (ctx) => {
  ctx.clearRect(0, 0, 5000, 5000);
};

export const drawRect = (ctx, origin, size) => {
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.rect(...origin, ...size);
  ctx.stroke();
};

export const drawOnCanvas = (
  ctx,
  startPosition,
  path,
  rotation = 0,
  color = "#000",
  scale = 50
) => {
  ctx.fillStyle = color;
  const base = [0, 0];
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
  ctx.beginPath();
  ctx.moveTo(base[0] + rotatedStart[0], base[1] + rotatedStart[1]);
  path.paths.forEach((path) => {
    if (path.type === "line") {
      const [x, y] = [
        startPosition[0] + path.coords[0] * scale,
        startPosition[1] + path.coords[1] * scale,
      ];
      const [rX, rY] = rotatePoint(x, y, ...rotationPoint, rotation);
      ctx.lineTo(Math.round(base[0] + rX), Math.round(base[1] + rY));
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
      ctx.bezierCurveTo(
        base[0] + rX0,
        base[1] + rY0,
        base[0] + rX1,
        base[1] + rY1,
        Math.round(base[0] + rX2),
        Math.round(base[1] + rY2)
      );
    }
    if (path.type === "circle") {
      const [x0, y0] = [
        startPosition[0] + path.coords[0] * scale,
        startPosition[1] + path.coords[1] * scale,
      ];
      const [rX0, rY0] = rotatePoint(x0, y0, ...rotationPoint, rotation);
      const r = path.coords[2] * scale;
      ctx.arc(
        Math.round(base[0] + rX0),
        Math.round(base[1] + rY0),
        r,
        path.coords[3],
        path.coords[4]
      );
    }
  });
  ctx.fill();
};

export const drawImageOnCanvas = (
  ctx,
  image,
  origin,
  size,
  dOrigin,
  dSize,
  alpha = 1,
  mode = "normal"
) => {
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = mode;
  ctx.drawImage(image, ...origin, ...size, ...dOrigin, ...dSize);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "normal";
};

export const getDrawnSize = (dots) => {
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
        const y = i + dot.position[1] - Math.floor(collisionMatrix.length / 2);
        const x = j + dot.position[0] - Math.floor(collisionMatrix.length / 2);
        if (y < 0 || y >= grid.length || x < 0 || x >= grid.length) continue;
        if (x < limits.minX) limits.minX = x;
        if (x > limits.maxX) limits.maxX = x;
        if (y < limits.minY) limits.minY = y;
        if (y > limits.maxY) limits.maxY = y;
      }
    }
  }
  return limits;
};
