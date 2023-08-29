export const square = {
  center: [0.5, 0.5],
  start: [0, 0],
  size: [1, 1],
  paths: [
    { type: "line", coords: [1, 0] },
    { type: "line", coords: [1, 1] },
    { type: "line", coords: [0, 1] },
    { type: "line", coords: [0, 0] },
  ],
  collision: { 0: [[1]], 90: [[1]], 180: [[1]], 270: [[1]] },
};

export const rectangle = {
  center: [0.5, 0.5],
  start: [0, 0],
  size: [2, 1],
  paths: [
    { type: "line", coords: [2.04, 0] },
    { type: "line", coords: [2.04, 1] },
    { type: "line", coords: [0, 1] },
    { type: "line", coords: [0, 0] },
  ],
  collision: {
    0: [
      [0, 0, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    90: [
      [0, 0, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
    180: [
      [0, 0, 0],
      [1, 1, 0],
      [0, 0, 0],
    ],
    270: [
      [0, 1, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
  },
};

export const curveCorner = {
  center: [0.5, 0.5],

  start: [0, 0],
  size: [1, 1],
  paths: [
    { type: "arc", coords: [0.55, 0, 1, 0.45, 1, 1] },
    { type: "line", coords: [0, 1] },
    { type: "line", coords: [0, 0] },
  ],
  collision: { 0: [[1]], 90: [[1]], 180: [[1]], 270: [[1]] },
};

export const digglet = {
  center: [0.5, 0.5],
  start: [0, 1],
  size: [1, 1],
  paths: [
    { type: "line", coords: [0, 0.5] },
    { type: "arc", coords: [0, 0.45 / 2, 0.5 - 0.55 / 2, 0, 0.5, 0] },
    { type: "arc", coords: [0.5 + 0.55 / 2, 0, 1, 0.45 / 2, 1, 0.5] },
    { type: "line", coords: [1, 1] },
  ],
  collision: { 0: [[1]], 90: [[1]], 180: [[1]], 270: [[1]] },
};

export const circle = {
  center: [0.5, 0.5],
  size: [1, 1],
  start: [0, 0.5],
  paths: [{ type: "circle", coords: [0.5, 0.5, 0.5, 0, 2 * Math.PI] }],
  collision: { 0: [[1]], 90: [[1]], 180: [[1]], 270: [[1]] },
};

export const angles = {
  0: 0,
  90: Math.PI / 2,
  180: Math.PI,
  270: (Math.PI * 3) / 2,
};
