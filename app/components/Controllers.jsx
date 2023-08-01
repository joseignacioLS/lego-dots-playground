import React from "react";
import styles from "./Controllers.module.scss";
import Dot from "./Dot";

const Controllers = ({
  templateTile,
  setTemplateTile,
  size,
  handleSizeChange,
  dotSize,
  handleDotSizeChange,
  color,
  setColor,
  rotateDot,
  deleteDot,
}) => {
  return (
    <section className={styles.controls}>
      <label>
        Size:
        <input
          type="range"
          value={size}
          min={4}
          max={32}
          step={4}
          onChange={(e) => handleSizeChange(+e.currentTarget.value)}
        />
        {size}
      </label>
      <label>
        Dot Size:
        <input
          type="range"
          value={dotSize}
          min={0.5}
          max={5}
          step={0.5}
          onChange={(e) => handleDotSizeChange(+e.currentTarget.value)}
        />
        {dotSize}
      </label>
      <div className={styles.templateTiles}>
        <div
          className={`${styles.cell} ${
            templateTile === undefined && styles.cellSelected
          }`}
          onClick={() => setTemplateTile(undefined)}
        >
          👆
        </div>
        {[1, 2, 3, 4].map((i) => {
          return (
            <div
              key={i}
              className={`${styles.cell} ${
                templateTile === i && styles.cellSelected
              }`}
              onClick={() => setTemplateTile(i)}
            >
              <Dot shape={i} rotation={0} color="#000000" />
            </div>
          );
        })}
      </div>
      <div className={styles.actions}>
        <input
          type="color"
          value={color}
          onInput={(e) => setColor(e.currentTarget.value)}
        />
        <button onClick={() => rotateDot(-1)}>Rotate</button>
        <button onClick={deleteDot}>Delete</button>
      </div>
    </section>
  );
};

export default Controllers;
