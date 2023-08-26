import React from "react";
import styles from "./Grid.module.scss";
import Dot from "./Dot";

const Grid = ({
  grid,
  selectedCell,
  selectedCell2,
  color,
  onClick,
  dotSize,
}) => {
  const isSelected = (i, j) => {
    if (selectedCell2[0] === undefined) {
      return selectedCell[0] === i && selectedCell[1] === j;
    } else {
      const dI = [selectedCell[0], selectedCell2[0]].sort((a,b) => a - b);
      const dJ = [selectedCell[1], selectedCell2[1]].sort((a,b) => a - b);
      return i >= dI[0] && i <= dI[1] && j >= dJ[0] && j <= dJ[1];
    }
  };
  return (
    <section className={styles.grid}>
      {grid.map((row, i) => {
        return (
          <div key={i} className={styles.row}>
            {row.map((cell, j) => {
              return (
                <div
                  key={j}
                  className={`${styles.cell} ${
                    isSelected(i, j) && styles.cellSelected
                  }`}
                  style={{
                    width: dotSize + "rem",
                  }}
                  onMouseDown={(e) => {
                    onClick(e, [i, j]);
                  }}
                >
                  {<Dot shape={cell[0]} rotation={cell[1]} color={color} />}
                </div>
              );
            })}
          </div>
        );
      })}
    </section>
  );
};

export default Grid;
