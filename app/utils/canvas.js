import { rotatePoint } from "./space";

export const drawOnCanvas = (
  ctx,
  startPosition,
  path,
  rotation = 0,
  color = "#000",
  scale = 50
) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  console.log(startPosition, path)
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
    if (path.type === "circle") {
      const [x0, y0] = [
        startPosition[0] + path.coords[0] * scale,
        startPosition[1] + path.coords[1] * scale,
      ];
      const [rX0, rY0] = rotatePoint(x0, y0, ...rotationPoint, rotation);
      const r = path.coords[2] * scale;
      ctx.arc(rX0, rY0, r, path.coords[3], path.coords[4]);
    }
  });
  ctx.fill();
};
