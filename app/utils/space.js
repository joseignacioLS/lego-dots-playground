export const rotatePoint = (x, y, rX, rY, angle) => {
  const dX = x - rX;
  const dY = y - rY;
  const fX = Math.cos(angle) * dX - Math.sin(angle) * dY + rX;
  const fY = Math.sin(angle) * dX + Math.cos(angle) * dY + rY;
  return [fX, fY];
};

export const positionToCoords = (x, y, dotSize) => {
  const gap = calculateGap(dotSize);
  return [x * (dotSize + gap), y * (dotSize + gap)];
};

export const coordsToPosition = (x, y, dotSize) => {
  const gap = calculateGap(dotSize);
  return [Math.floor(x / (dotSize + gap)), Math.floor(y / (dotSize + gap))];
};

export const calculateGap = (dotSize) => {
  return Math.max(1, Math.floor(dotSize * 0.04));
};
