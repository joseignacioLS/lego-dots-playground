"use client";

import { useContext, useEffect, useState } from "react";
import styles from "./page.module.scss";
import Controllers from "./components/Controllers";
import { ModalContext } from "./context/modal";
import Modal from "./components/Modal";
import Instructions from "./components/Instructions";
import Canvas from "./components/Canvas";

export default function Home() {
  const [dots, setDots] = useState([]);
  const [dotSize, setDotSize] = useState(64);
  const [color, setColor] = useState("#000000");
  const [rotation, setRotation] = useState(0);
  const [selectedDots, setSelectedDots] = useState([]);
  const [templateTile, setTemplateTile] = useState(undefined);
  const [printMode, setPrintMode] = useState(false);

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
        setDots(parsed);
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

  const handleDotSizeChange = (value) => {
    setDotSize(value);
  };

  // MODIFY DOTS
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
  }, [selectedDots, dots]);

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
        dotSize={dotSize}
        handleDotSizeChange={handleDotSizeChange}
        color={color}
        setColor={updateColor}
        rotateDot={rotateDot}
        deleteDot={removeSelectedDots}
        removeAllDots={removeAllDots}
        loadGrid={loadGrid}
        exportGrid={exportGrid}
        printMode={printMode}
        setPrintMode={setPrintMode}
      />
      {isVisible && <Modal></Modal>}
    </main>
  );
}
