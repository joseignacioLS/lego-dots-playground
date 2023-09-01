import { CanvasContext } from "@/app/context/canvas";
import React, { useContext } from "react";

import styles from "./Templates.module.scss";

const ColorBar = ({ colors }) => {
  const { color, updateColor } = useContext(CanvasContext);
  return (
    <div className={styles.templateBar}>
      {colors.map((ccolor) => {
        return (
          <div
            key={ccolor}
            onClick={(e) => {
              updateColor(ccolor);
            }}
            style={{
              width: "2rem",
              height: "2rem",
              backgroundColor: ccolor,
              border: ccolor === color && "2px solid red",
            }}
          ></div>
        );
      })}
    </div>
  );
};

export default ColorBar;
