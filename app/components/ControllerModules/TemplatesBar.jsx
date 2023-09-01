import { CanvasContext } from "@/app/context/canvas";

import React, { useContext } from "react";
import Miniature from "./Miniature";

import styles from "./Templates.module.scss";

const TemplatesBar = ({ templates = [] }) => {
  const { color, template, setTemplate } = useContext(CanvasContext);
  return (
    <div className={styles.templateBar}>
      <div
        className={`${styles.cell} ${
          template === undefined && styles.cellSelected
        }`}
        onClick={() => setTemplate(undefined)}
      >
        👆
      </div>
      {templates.map((ttemplate, i) => {
        if (!ttemplate?.size) return <>X</>;
        return (
          <div
            key={i}
            className={`${styles.cell} ${
              ttemplate === template && styles.cellSelected
            }`}
            style={{ border: "1px solid black" }}
            onClick={() => setTemplate(ttemplate)}
          >
            <Miniature
              template={ttemplate}
              color={color}
              size={32}
              w={ttemplate?.size?.[0]}
              h={ttemplate?.size?.[1]}
            />
          </div>
        );
      })}
    </div>
  );
};

export default TemplatesBar;
