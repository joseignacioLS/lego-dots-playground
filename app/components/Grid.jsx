import React from "react";
import styles from "./Grid.module.scss";
import Dot from "./Dot";

const Grid = ({ grid, selectedCell, color, onClick, dotSize }) => {
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
                    selectedCell[0] === i &&
                    selectedCell[1] === j &&
                    styles.cellSelected
                  }`}
                  style={{
                    width: dotSize + "rem",
                  }}
                  onClick={(e) => {
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
