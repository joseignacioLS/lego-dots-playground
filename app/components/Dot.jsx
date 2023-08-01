import React from "react";
import styles from "./Dot.module.scss";

const dotShape = {
  0: styles.empty,
  1: styles.dotRect,
  2: styles.dotCurve,
  3: styles.dotSemiCircle,
  4: styles.dotCircle,
};

const dotRotation = {
  0: styles.noRot,
  1: styles.rot90,
  2: styles.rot180,
  3: styles.rot270,
};

const Dot = ({ shape, rotation, color }) => {
  return (
    <div
      data-color={color}
      className={`${styles.dot} ${dotShape[shape]} ${dotRotation[rotation]}`}
      style={{
        background:
          shape === 3
            ? `linear-gradient(
          to top,
          ${color},
          ${color} 50%,
          transparent 50%,
          transparent
        )`
            : color,
      }}
    >
      {shape === 3 && <div style={{ backgroundColor: color }}></div>}
    </div>
  );
};

export default Dot;
