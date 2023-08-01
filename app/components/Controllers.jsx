import React from "react";
import styles from "./Controllers.module.scss";
import Dot from "./Dot";

const Controllers = ({
  templateTile,
  setTemplateTile,
  size,
  handleSizeChange,
  color,
  setColor,
}) => {
  return (
    <section className={styles.controls}>
      <label>
        Size: {size}
        <input
          type="range"
          value={size}
          min={4}
          max={32}
          step={4}
          onChange={(e) => handleSizeChange(+e.currentTarget.value)}
        />
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
      <div>
        <input
          type="color"
          value={color}
          onInput={(e) => setColor(e.currentTarget.value)}
        />
      </div>
    </section>
  );
};

export default Controllers;
