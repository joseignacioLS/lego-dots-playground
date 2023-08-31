"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { colors } from "../data/data";
import { coordsToPosition } from "../utils/space";
import { MouseContext } from "./mouse";
import { getDrawnSize } from "../utils/canvas";

export const CanvasContext = createContext(null);

export const CanvasContextProvider = ({ children }) => {
  const [dots, setDots] = useState([]);
  const [selectedDots, setSelectedDots] = useState([]);
  const [dotSize, setDotSize] = useState(64);
  const [color, setColor] = useState(colors[0]);
  const [rotation, setRotation] = useState(0);
  const [template, setTemplate] = useState(undefined);
  const [printMode, setPrintMode] = useState(false);
  const [limits, setLimits] = useState({
    minX: 0,
    maxX: 10,
    minY: 0,
    maxY: 10
  })

  const updateLimits = (key, delta) => {
    if (!(key in limits)) return

    setLimits(oldValue => {
      return { ...oldValue, [key]: oldValue[key] + delta }
    })
  }

  const { mousePosition } = useContext(MouseContext);

  const addDot = (dot) => {
    setDots((oldValue) => [...oldValue, dot]);
  };

  const placeDot = (dot) => {
    // TODO: Check multiple collisions
    const index = checkCollisions({
      position: dot.position,
      collision: dot.dot.collision[dot.rotation],
    });
    if (index === Infinity) return;
    if (index > -1) removeDot([index]);
    addDot(dot);
  };

  const removeSelectedDots = () => {
    setDots((oldValue) => {
      return oldValue.filter((dot, i) => !selectedDots.includes(i));
    });
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

  const toggleSelected = (dot) => {
    if (dot === undefined) return setSelectedDots([]);
    setSelectedDots((oldValue) => {
      if (oldValue.includes(dot)) return oldValue.filter((d) => d !== dot);
      return [...oldValue, dot];
    });
  };

  const selectAll = () => {
    setSelectedDots([...new Array(dots.length)].map((_, i) => i));
  };

  const handleDotSizeChange = (value) => {
    setDotSize(value);
  };

  const loadGrid = () => {
    const fileInput = document.querySelector("#file");
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const fileContents = e.target.result;
      try {
        const parsed = JSON.parse(fileContents);
        if (!Array.isArray(parsed)) return;
        parsed.forEach((dot) => {
          addDot(dot);
        });
      } catch (err) {
        console.log(err);
      }
    };
    reader.readAsText(file);
  };

  const exportGrid = () => {
    const filename = "design.json";
    const data = JSON.stringify(dots);
    let element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(data)
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const updateColor = (value) => {
    setColor(value);
    setDots((oldValue) => {
      return oldValue.map((dot, i) => {
        if (selectedDots.includes(i)) {
          dot.color = value;
        }
        return dot;
      });
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

  const checkCollisions = ({ position, collision }) => {
    const grid = [...new Array(200)].map((_) =>
      [...new Array(200)].map((_) => 0)
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

  const copySelection = () => {

    const copiedDots = dots.filter((dot, i) => selectedDots.includes(i));
    navigator.clipboard.writeText(JSON.stringify(copiedDots))
    setSelectedDots([])
  }


  const pasteSelection = async () => {
    const mouse = coordsToPosition(...mousePosition, dotSize);
    const copiedDots = JSON.parse(await navigator.clipboard.readText().then(data => data))
    console.log(copiedDots)
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
    }
    catch (err) {
      console.log(err)
      alert("Wrong Paste Content Format")
    }
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
        template,
        setTemplate,
        printMode,
        setPrintMode,
        loadGrid,
        exportGrid,
        checkCollisions,
        limits,
        updateLimits
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};
