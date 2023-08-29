"use client";

import { useContext, useEffect, useState } from "react";
import styles from "./page.module.scss";
import Controllers from "./components/Controllers";
import { ModalContext } from "./context/modal";
import Modal from "./components/Modal";
import Instructions from "./components/Instructions";
import { colors } from "./data/data";
import Canvas from "./components/Canvas";

const generateGrid = (value) => {
  return [...new Array(value)].map((_) => {
    return [...new Array(value)].map((_) => [0, 0, colors[0]]);
  });
};

const initialValue = generateGrid(8);

export default function Home() {
  const [dots, setDots] = useState([]);
  const [size, setSize] = useState(8);
  const [dotSize, setDotSize] = useState(128);
  const [color, setColor] = useState("#000000");
  const [rotation, setRotation] = useState(0);
  const [selectedDots, setSelectedDots] = useState([]);
  const [templateTile, setTemplateTile] = useState(undefined);
  const [printMode, setPrintMode] = useState(false);

  const [grid, setGrid] = useState(initialValue);

  const { isVisible, openModal } = useContext(ModalContext);

  const addDot = (dot) => {
    setDots((oldValue) => [...oldValue, dot]);
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

  const toggleSelected = (dot) => {
    if (dot === undefined) return setSelectedDots([]);
    setSelectedDots((oldValue) => {
      if (oldValue.includes(dot)) return oldValue.filter((d) => d !== dot);
      return [...oldValue, dot];
    });
  };

  // GRID

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
        if (parsed.length !== parsed[0].length) return;
        if (parsed[0][0].length !== 2) return;
        setSize(parsed.length);
        setGrid(parsed);
      } catch (err) {
        console.log(err);
      }
    };
    reader.readAsText(file);
  };

  const exportGrid = () => {
    const filename = "design.json";
    const data = JSON.stringify(grid);
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

  const handleSizeChange = (value) => {
    setSize(value);
    setGrid((oldGrid) => {
      const newGrid = generateGrid(value);
      oldGrid.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (newGrid.length <= y) return;
          if (newGrid[y].length <= x) return;
          newGrid[y][x] = cell;
        });
      });
      return newGrid;
    });
  };

  const handleDotSizeChange = (value) => {
    setDotSize(value);
  };

  // MODIFY DOTS
  const updateColor = (value) => {
    setColor(value);
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
    selectedDots.forEach((dot) => {
      dots[dot].position = [
        dots[dot].position[0] + dX,
        dots[dot].position[1] + dY,
      ];
    });
  };

  // EVENT LISTENERS

  const generateListeners = (e) => {
    e.preventDefault();
    if (e.key === "q") {
      removeSelectedDots();
    } else if (e.key === "r") {
      rotateDot(1);
    } else if (e.key === "w") {
      rotateDot(-1);
    } else if (e.key === "e") {
      setTemplateTile(undefined);
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
  }, [selectedDots]);

  useEffect(() => {
    if (printMode) setSelectedDots([]);
  }, []);

  return (
    <main className={styles.main}>
      <h1>
        Lego Dots Playground DEVELOP
        <span onClick={() => openModal(<Instructions />)}>💡</span>
      </h1>
      <Canvas
        dotSize={dotSize}
        size={size}
        dots={dots}
        addDot={addDot}
        removeDot={removeDot}
        color={color}
        rotation={rotation}
        template={templateTile}
        printMode={printMode}
        selectedDots={selectedDots}
        toggleSelected={toggleSelected}
      />
      <Controllers
        templateTile={templateTile}
        setTemplateTile={setTemplateTile}
        size={size}
        handleSizeChange={handleSizeChange}
        dotSize={dotSize}
        handleDotSizeChange={handleDotSizeChange}
        color={color}
        setColor={updateColor}
        rotateDot={rotateDot}
        deleteDot={removeSelectedDots}
        loadGrid={loadGrid}
        exportGrid={exportGrid}
        printMode={printMode}
        setPrintMode={setPrintMode}
      />
      {isVisible && <Modal></Modal>}
    </main>
  );
}
