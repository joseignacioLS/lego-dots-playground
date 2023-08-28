"use client";

import { useContext, useEffect, useState } from "react";
import styles from "./page.module.scss";
import Controllers from "./components/Controllers";
import Grid from "./components/Grid";
import { ModalContext } from "./context/modal";
import Modal from "./components/Modal";
import Instructions from "./components/Instructions";
import { colors } from "./data/data";

const generateGrid = (value) => {
  return [...new Array(value)].map((_) => {
    return [...new Array(value)].map((_) => [0, 0, colors[0]]);
  });
};

const initialValue = generateGrid(8);

export default function Home() {
  const [size, setSize] = useState(8);
  const [dotSize, setDotSize] = useState(2);
  const [color, setColor] = useState("#000000");
  const [grid, setGrid] = useState(initialValue);
  const [printMode, setPrintMode] = useState(false);
  const [templateTile, setTemplateTile] = useState(undefined);
  const [selectedCell, setSelectedCell] = useState([undefined, undefined]);
  const [multiSelect, setMultiSelect] = useState(false);
  const [selectedCell2, setSelectedCell2] = useState([undefined, undefined]);

  const { isVisible, openModal } = useContext(ModalContext);

  const onClick = (e, position) => {
    e.preventDefault();
    setGrid((oldState) => {
      return oldState.map((row, y) => {
        if (y !== position[0]) return row;
        return row.map((cell, x) => {
          if (x !== position[1]) return cell;
          if (multiSelect && selectedCell[0] !== undefined) {
            setSelectedCell2([y, x]);
          } else {
            setSelectedCell2([undefined, undefined]);
            setSelectedCell([y, x]);
          }
          if (templateTile === undefined) return cell;
          cell[0] = templateTile;
          cell[2] = color;
          return cell;
        });
      });
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

  // HELPER SELECTION
  const isInsideGrid = (x, y) => {
    return y >= 0 && x >= 0 && x < grid[0].length && y < grid.length;
  };

  const isInsideSelection = (x, y) => {
    if (selectedCell2[0] === undefined)
      return selectedCell[0] === y && selectedCell[1] === x;
    const dI = [selectedCell[0], selectedCell2[0]].sort((a, b) => a - b);
    const dJ = [selectedCell[1], selectedCell2[1]].sort((a, b) => a - b);
    return y >= dI[0] && y <= dI[1] && x >= dJ[0] && x <= dJ[1];
  };

  // MODIFY DOTS
  const updateColor = (value) => {
    setColor(value);
    setGrid((oldValue) => {
      return oldValue.map((row, y) => {
        return row.map((cell, x) => {
          if (cell[0] === 0) return cell;
          if (isInsideSelection(x, y)) {
            cell[2] = value;
          }
          return cell;
        });
      });
    });
  };

  const deleteDot = () => {
    setGrid((oldState) => {
      return oldState.map((row, y) => {
        return row.map((cell, x) => {
          if (isInsideSelection(x, y)) {
            setSelectedCell([undefined, undefined]);
            cell[0] = 0;
            cell[1] = 0;
          }
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

  const updateSelectedCell = (setter, dY, dX) => {
    setter((old) => {
      let x = old[0] + dX;
      let y = old[1] + dY;
      if (x < 0) x = 0;
      if (y < 0) y = 0;
      if (x >= grid[0].length) x = grid[0].length - 1;
      if (y >= grid.length) y = grid.length - 1;
      return [x, y];
    });
  };

  const moveDot = (dX = 0, dY = 0) => {
    if (selectedCell[0] === undefined) return;
    setGrid((oldGrid) => {
      const value = oldGrid[selectedCell[0]][selectedCell[1]];
      const newGrid = generateGrid(oldGrid.length);
      oldGrid.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (newGrid.length <= y) return;
          if (newGrid[y].length <= x) return;
          newGrid[y][x] = cell;
        });
      });
      if (selectedCell2[0] === undefined) {
        try {
          if (isInsideGrid(selectedCell[1] + dX, selectedCell[0] + dY)) {
            newGrid[selectedCell[0] + dY][selectedCell[1] + dX] = value;
            newGrid[selectedCell[0]][selectedCell[1]] = [0, 0];
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        const dI = [selectedCell[0], selectedCell2[0]].sort((a, b) => a - b);
        const dJ = [selectedCell[1], selectedCell2[1]].sort((a, b) => a - b);
        try {
          const sample = [];
          for (let i = dI[0]; i <= dI[1]; i++) {
            sample.push([]);
            for (let j = dJ[0]; j <= dJ[1]; j++) {
              sample.at(-1).push(oldGrid[i][j]);
              newGrid[i][j] = [0, 0];
            }
          }
          for (let i = dI[0]; i <= dI[1]; i++) {
            for (let j = dJ[0]; j <= dJ[1]; j++) {
              newGrid[i + dY][j + dX] = sample[i - dI[0]][j - dJ[0]];
            }
          }
          updateSelectedCell(setSelectedCell2, dX, dY);
        } catch (err) {
          console.log(err);
        }
      }
      updateSelectedCell(setSelectedCell, dX, dY);
      return newGrid;
    });
  };

  // EVENT LISTENERS

  const generateListeners = (e) => {
    e.preventDefault();
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
    } else if (e.key === "ArrowRight") {
      moveDot(1, 0);
    } else if (e.key === "ArrowLeft") {
      moveDot(-1, 0);
    } else if (e.key === "ArrowUp") {
      moveDot(0, -1);
    } else if (e.key === "ArrowDown") {
      moveDot(0, 1);
    } else if (e.key === "Shift") {
      setMultiSelect(true);
    }
  };

  const generateReleaseListeners = (e) => {
    if (e.key === "Shift") {
      setMultiSelect(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", generateListeners);
    document.addEventListener("keyup", generateReleaseListeners);
    return () => {
      document.removeEventListener("keydown", generateListeners);
      document.removeEventListener("keyup", generateReleaseListeners);
    };
  }, [selectedCell, selectedCell2]);

  return (
    <main className={styles.main}>
      <h1>
        Lego Dots Playground DEVELOP
        <span onClick={() => openModal(<Instructions />)}>💡</span>
      </h1>

      <Grid
        grid={grid}
        selectedCell={selectedCell}
        selectedCell2={selectedCell2}
        color={color}
        onClick={onClick}
        dotSize={dotSize}
        printMode={printMode}
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
        deleteDot={deleteDot}
        loadGrid={loadGrid}
        exportGrid={exportGrid}
        printMode={printMode}
        setPrintMode={setPrintMode}
      />
      {isVisible && <Modal></Modal>}
    </main>
  );
}
