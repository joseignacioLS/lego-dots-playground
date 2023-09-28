"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { colors } from "../data/data";
import { calculateGap, coordsToPosition } from "../utils/space";
import { MouseContext } from "./mouse";
import { getDrawnSize } from "../utils/canvas";
import { loadFile, saveToFile } from "../utils/file";

export const CanvasContext = createContext(null);

export const CanvasContextProvider = ({ children }) => {
  const { mousePosition, mouseDrag, cleanDrag } = useContext(MouseContext);

  const [dots, setDots] = useState([]);
  const [selectedDots, setSelectedDots] = useState([]);
  const [dotSize, setDotSize] = useState(36);
  const [gap, setGap] = useState(0);
  const [color, setColor] = useState(colors[0]);
  const [rotation, setRotation] = useState(0);
  const [template, setTemplate] = useState(undefined);
  const [printMode, setPrintMode] = useState(false);
  const [background, setBackground] = useState(true);
  const [imageFilter, setImageFilter] = useState(true);
  const [limits, setLimits] = useState({
    minX: 0,
    maxX: 8,
    minY: 0,
    maxY: 8,
  });

  const updateLimits = (key, delta) => {
    if (!(key in limits)) return;

    setLimits((oldValue) => {
      return { ...oldValue, [key]: oldValue[key] + delta };
    });
  };

  const addDot = (dot) => {
    setDots((oldValue) => [...oldValue, dot]);
  };

  const placeDot = (dot) => {
    const collisions = checkCollisions({
      position: dot.position,
      collisionMatrix: dot.dot.collision[dot.rotation],
    });
    if (collisions.length) {
      if (collisions.includes(Infinity)) return;
      removeDot(collisions);
    }
    addDot(dot);
  };

  const removeSelectedDots = () => {
    removeDot(selectedDots);
    setSelectedDots([]);
  };

  const removeDot = (dots) => {
    setDots((oldValue) => {
      return oldValue.filter((dot, i) => !dots.includes(i));
    });
  };

  const removeAllDots = () => {
    setDots([]);
  };

  const toggleSelected = (dotArr) => {
    if (dotArr === undefined) return setSelectedDots([]);
    dotArr.forEach((dot) => {
      setSelectedDots((oldValue) => {
        return oldValue.includes(dot)
          ? oldValue.filter((d) => d !== dot)
          : [...oldValue, dot];
      });
    });
  };

  const selectAll = () => {
    setSelectedDots([...new Array(dots.length)].map((_, i) => i));
  };

  const handleDotSizeChange = (value) => {
    setDotSize(value);
  };

  const loadGrid = () => {
    const callback = (dots) => dots.forEach((dot) => addDot(dot));
    loadFile("#file", callback);
  };

  const exportGrid = () => {
    saveToFile("design.json", dots);
  };

  const updateColor = (value) => {
    setColor(value);
    setDots((oldValue) => {
      const newValue = [...oldValue];
      selectedDots.forEach((i) => {
        newValue[i].color = value;
      });
      return newValue;
    });
    toggleSelected(undefined);
  };

  const rotateDot = (dir = 1) => {
    setRotation((oldValue) => {
      let newValue = oldValue + 90 * dir;
      if (newValue < 0) newValue += 360;
      if (newValue >= 360) newValue -= 360;
      return newValue;
    });
  };

  const moveDot = (dX = 0, dY = 0) => {
    setDots((oldDots) => {
      return oldDots.map((dot, i) => {
        if (!selectedDots.includes(i)) return dot;
        dot.position = [dot.position[0] + dX, dot.position[1] + dY];
        return dot;
      });
    });
  };

  const generateCollisionGrid = (position, collisionMatrix) => {
    const grid = [...new Array(200)].map((_) =>
      [...new Array(200)].map((_) => [])
    );

    for (let i = 0; i < collisionMatrix.length; i++) {
      for (let j = 0; j < collisionMatrix[i].length; j++) {
        if (collisionMatrix[i][j].length === 0) continue;
        const y = i + position[1] - Math.floor(collisionMatrix.length / 2);
        const x = j + position[0] - Math.floor(collisionMatrix[0].length / 2);
        if (y < 0 || y >= grid.length || x < 0 || x >= grid[0].length) {
          collisions.push(Infinity);
          continue;
        }
        grid[i + position[1] - Math.floor(collisionMatrix.length / 2)][
          j + position[0] - Math.floor(collisionMatrix[0].length / 2)
        ] = collisionMatrix[i][j];
      }
    }
    return grid;
  };

  const checkCollisions = ({ position, collisionMatrix }) => {
    const collisions = [];
    const grid = generateCollisionGrid(position, collisionMatrix);

    dots.forEach((dot, n) => {
      const collisionMatrix = dot.dot.collision[dot.rotation];

      for (let i = 0; i < collisionMatrix.length; i++) {
        for (let j = 0; j < collisionMatrix[i].length; j++) {
          if (collisionMatrix[i][j].length === 0) continue;
          const y =
            i + dot.position[1] - Math.floor(collisionMatrix.length / 2);
          const x =
            j + dot.position[0] - Math.floor(collisionMatrix[0].length / 2);
          if (y < 0 || y >= grid.length || x < 0 || x >= grid.length) continue;
          if (
            grid[y][x].reduce((acc, curr, k) => {
              return curr + collisionMatrix[i][j][k] > 1 || acc;
            }, false)
          ) {
            if (collisions.includes(n)) continue;
            collisions.push(n);
          }
        }
      }
    });
    return collisions;
  };

  const copySelection = () => {
    const copiedDots = dots.filter((dot, i) => selectedDots.includes(i));
    navigator.clipboard.writeText(JSON.stringify(copiedDots));
    setSelectedDots([]);
  };

  const pasteSelection = async () => {
    const mouse = coordsToPosition(...mousePosition, dotSize);
    const copiedDots = JSON.parse(
      await navigator.clipboard.readText().then((data) => data)
    );
    try {
      const limits = getDrawnSize(copiedDots);
      copiedDots.forEach((dot) => {
        const ele = { ...dot };
        ele.position = [
          dot.position[0] - limits.minX + mouse[0],
          dot.position[1] - limits.minY + mouse[1],
        ];
        placeDot(ele);
      });
    } catch (err) {
      console.log(err);
      alert("Wrong Paste Content Format");
    }
  };

  const dragSelect = () => {
    if (!mouseDrag[0] || !mouseDrag[1]) return cleanDrag();
    const size = mouseDrag.map((p) => {
      return coordsToPosition(...p, dotSize);
    });

    const limits = {
      minX: Math.min(size[0][0], size[1][0]),
      maxX: Math.max(size[0][0], size[1][0]),
      minY: Math.min(size[0][1], size[1][1]),
      maxY: Math.max(size[0][1], size[1][1]),
    };

    const dX = limits.maxX - limits.minX;
    const dY = limits.maxY - limits.minY;
    const position = [limits.minX, limits.minY];
    const collisionMatrix = [...new Array(dY * 2 + 1)].map((_, y) => {
      return [...new Array(dX * 2 + 1)].map((_, x) =>
        y >= dY && x >= dX ? [1, 1, 1, 1] : []
      );
    });

    const collisions = checkCollisions({
      position,
      collisionMatrix,
    });

    collisions.forEach((i) => {
      if (selectedDots.includes(i)) return;
      toggleSelected([i]);
    });
    cleanDrag();
  };

  const calculateHighResSize = (canvasBaseSize) => {
    const columns = limits.maxX - limits.minX + 1;
    const rows = limits.maxY - limits.minY + 1;
    const res = printMode ? canvasBaseSize / Math.max(columns, rows) : dotSize;

    const highResSize = [
      (res + calculateGap(res)) * columns,
      (res + calculateGap(res)) * rows,
    ];
    return { highResSize, res, columns, rows };
  };

  useEffect(() => {
    if (printMode) setSelectedDots([]);
  }, []);

  const generateListeners = (e) => {
    e.preventDefault();
    if (e.key === "q") {
      removeSelectedDots();
    } else if (e.key === "r") {
      rotateDot(1);
    } else if (e.key === "w") {
      rotateDot(-1);
    } else if (e.key === "e") {
      setTemplate(undefined);
    } else if (e.key === "c") {
      copySelection();
    } else if (e.key === "v") {
      pasteSelection();
    } else if (e.key === "f") {
      setSelectedDots([]);
    } else if (e.key === "a") {
      selectAll();
    } else if (e.key === "d") {
      setPrintMode((old) => !old);
    } else if (e.key === "s") {
      exportGrid();
    } else if (e.key === "ArrowRight") {
      moveDot(1, 0);
    } else if (e.key === "ArrowLeft") {
      moveDot(-1, 0);
    } else if (e.key === "ArrowUp") {
      moveDot(0, -1);
    } else if (e.key === "ArrowDown") {
      moveDot(0, 1);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", generateListeners);
    return () => {
      document.removeEventListener("keydown", generateListeners);
    };
  }, [selectedDots, dots, dotSize, mousePosition]);

  useEffect(() => {
    setGap(calculateGap(dotSize));
  }, [dotSize]);

  return (
    <CanvasContext.Provider
      value={{
        dots,
        addDot,
        placeDot,
        moveDot,
        removeSelectedDots,
        removeDot,
        removeAllDots,
        selectedDots,
        toggleSelected,
        color,
        setColor,
        updateColor,
        rotation,
        rotateDot,
        dotSize,
        handleDotSizeChange,
        gap,
        template,
        setTemplate,
        printMode,
        setPrintMode,
        loadGrid,
        exportGrid,
        checkCollisions,
        limits,
        updateLimits,
        dragSelect,
        background,
        setBackground,
        calculateHighResSize,
        imageFilter,
        setImageFilter,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};
