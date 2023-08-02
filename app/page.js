"use client";

import { useContext, useEffect, useState } from "react";
import styles from "./page.module.scss";
import Controllers from "./components/Controllers";
import Grid from "./components/Grid";
import { ModalContext } from "./context/modal";
import Modal from "./components/Modal";
import Instructions from "./components/Instructions";

const generateGrid = (value) => {
  return [...new Array(value)].map((_) => {
    return [...new Array(value)].map((_) => [0, 0]);
  });
};

const initialValue = generateGrid(8);

export default function Home() {
  const [size, setSize] = useState(8);
  const [dotSize, setDotSize] = useState(2);
  const [color, setColor] = useState("#000000");
  const [grid, setGrid] = useState(initialValue);
  const [templateTile, setTemplateTile] = useState(undefined);
  const [selectedCell, setSelectedCell] = useState([undefined, undefined]);

  const { isVisible, openModal } = useContext(ModalContext);

  const onClick = (e, position) => {
    e.preventDefault();
    setGrid((oldState) => {
      return oldState.map((row, y) => {
        if (y !== position[0]) return row;
        return row.map((cell, x) => {
          if (x !== position[1]) return cell;
          setSelectedCell([y, x]);
          if (templateTile === undefined) return cell;
          cell[0] = templateTile;
          return cell;
        });
      });
    });
  };

  const deleteDot = () => {
    setGrid((oldState) => {
      return oldState.map((row, y) => {
        if (y !== selectedCell[0]) return row;
        return row.map((cell, x) => {
          if (x !== selectedCell[1]) return cell;
          setSelectedCell([undefined, undefined]);
          cell[0] = 0;
          cell[1] = 0;
          return cell;
        });
      });
    });
  };

  const rotateDot = (dir = 1) => {
    setGrid((oldState) => {
      return oldState.map((row, y) => {
        if (y !== selectedCell[0]) return row;
        return row.map((cell, x) => {
          if (x !== selectedCell[1]) return cell;
          cell[1] += dir;
          if (cell[1] > 3) cell[1] = 0;
          if (cell[1] < 0) cell[1] = 3;
          return cell;
        });
      });
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
        if (parsed.length !== parsed[0].length) return;
        if (parsed[0][0].length !== 2) return;
        setSize(parsed.length);
        setGrid(parsed);
        setSelectedCell([undefined, undefined]);
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
    setGrid(generateGrid(value));
  };

  const handleDotSizeChange = (value) => {
    setDotSize(value);
  };

  const generateListeners = (e) => {
    if (e.key === "q") {
      deleteDot();
    } else if (e.key === "r") {
      rotateDot(-1);
    } else if (e.key === "w") {
      rotateDot(1);
    } else if (e.key === "e") {
      setTemplateTile(undefined);
    } else if (e.key === "1") {
      setTemplateTile(1);
    } else if (e.key === "2") {
      setTemplateTile(2);
    } else if (e.key === "3") {
      setTemplateTile(3);
    } else if (e.key === "4") {
      setTemplateTile(4);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", generateListeners);
    return () => {
      document.removeEventListener("keydown", generateListeners);
    };
  }, [selectedCell]);

  return (
    <main className={styles.main}>
      <h1>
        Lego Dots Playground{" "}
        <span onClick={() => openModal(<Instructions />)}>💡</span>
      </h1>

      <Grid
        grid={grid}
        selectedCell={selectedCell}
        color={color}
        onClick={onClick}
        dotSize={dotSize}
      />
      <Controllers
        templateTile={templateTile}
        setTemplateTile={setTemplateTile}
        size={size}
        handleSizeChange={handleSizeChange}
        dotSize={dotSize}
        handleDotSizeChange={handleDotSizeChange}
        color={color}
        setColor={setColor}
        rotateDot={rotateDot}
        deleteDot={deleteDot}
        loadGrid={loadGrid}
        exportGrid={exportGrid}
      />
      {isVisible && <Modal></Modal>}
    </main>
  );
}
