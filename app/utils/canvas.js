import { rotatePoint } from "./space";

export const cleanCanvas = (ctx) => {
  ctx.clearRect(0, 0, 5000, 5000);
};

export const drawOnCanvas = (
  ctx,
  startPosition,
  path,
  rotation = 0,
  color = "#000",
  scale = 50,
  margin = undefined
) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  const base = margin
    ? [-(margin[0] - 1) * scale * 1.04, -(margin[1] - 1) * scale * 1.04]
    : [0, 0];
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
  ctx.moveTo(base[0] + rotatedStart[0], base[1] + rotatedStart[1]);
  path.paths.forEach((path) => {
    if (path.type === "line") {
      const [x, y] = [
        startPosition[0] + path.coords[0] * scale,
        startPosition[1] + path.coords[1] * scale,
      ];
      const [rX, rY] = rotatePoint(x, y, ...rotationPoint, rotation);
      ctx.lineTo(base[0] + rX, base[1] + rY);
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
        base[0] + rX2,
        base[1] + rY2
      );
    }
    if (path.type === "circle") {
      const [x0, y0] = [
        startPosition[0] + path.coords[0] * scale,
        startPosition[1] + path.coords[1] * scale,
      ];
      const [rX0, rY0] = rotatePoint(x0, y0, ...rotationPoint, rotation);
      const r = path.coords[2] * scale;
      ctx.arc(base[0] + rX0, base[1] + rY0, r, path.coords[3], path.coords[4]);
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
