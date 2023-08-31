import React, { useContext, useEffect } from "react";
import styles from "./Controllers.module.scss";
import { ModalContext } from "../context/modal";
import { colors } from "../data/data";
import {
  circle,
  curve3x3,
  curveCorner,
  digglet,
  rectangle,
  square,
} from "../data/dots";
import Miniature from "./Miniature";
import { CanvasContext } from "../context/canvas";

const templates = [square, curveCorner, digglet, circle, rectangle, curve3x3];

const Controllers = ({}) => {
  const { openModal, hideModal } = useContext(ModalContext);
  const {
    removeAllDots,
    removeSelectedDots,
    handleDotSizeChange,
    printMode,
    dotSize,
    template,
    setTemplate,
    color,
    updateColor,
    exportGrid,
    loadGrid,
    setPrintMode,
    limits,
    updateLimits,
  } = useContext(CanvasContext);

  return (
    <section className={styles.controls}>
      <label>
        <input
          type="checkbox"
          checked={printMode}
          onChange={(e) => setPrintMode(e.currentTarget.checked)}
        ></input>
        Print Mode
      </label>
      {!printMode && (
        <>
          <div className={styles.managing}>
            <label className={styles.labelAndButtons}>
              Dot Size
              <div>
                <button onClick={(e) => handleDotSizeChange(dotSize - 4)}>
                  -
                </button>
                <span
                  style={{
                    display: "inline-block",
                    width: "2rem",
                    margin: "0 .5rem",
                    textAlign: "center",
                  }}
                >
                  {dotSize}
                </span>

                <button onClick={(e) => handleDotSizeChange(dotSize + 4)}>
                  +
                </button>
              </div>
            </label>
            <div className={styles.oneLine}>
              <label className={styles.labelAndButtons}>
                Left Limit
                <div>
                  <button onClick={(e) => updateLimits("minX", -1)}>-</button>
                  <span
                    style={{
                      display: "inline-block",
                      width: "2rem",
                      margin: "0 .5rem",
                      textAlign: "center",
                    }}
                  >
                    {limits.minX}
                  </span>

                  <button onClick={(e) => updateLimits("minX", 1)}>+</button>
                </div>
              </label>
              <label className={styles.labelAndButtons}>
                Right Limit
                <div>
                  <button onClick={(e) => updateLimits("maxX", -1)}>-</button>
                  <span
                    style={{
                      display: "inline-block",
                      width: "2rem",
                      margin: "0 .5rem",
                      textAlign: "center",
                    }}
                  >
                    {limits.maxX}
                  </span>

                  <button onClick={(e) => updateLimits("maxX", 1)}>+</button>
                </div>
              </label>
            </div>
            <div className={styles.oneLine}>
              <label className={styles.labelAndButtons}>
                Top Limit
                <div>
                  <button onClick={(e) => updateLimits("minY", -1)}>-</button>
                  <span
                    style={{
                      display: "inline-block",
                      width: "2rem",
                      margin: "0 .5rem",
                      textAlign: "center",
                    }}
                  >
                    {limits.minY}
                  </span>

                  <button onClick={(e) => updateLimits("minY", 1)}>+</button>
                </div>
              </label>
              <label className={styles.labelAndButtons}>
                Bottom Limit
                <div>
                  <button onClick={(e) => updateLimits("maxY", -1)}>-</button>
                  <span
                    style={{
                      display: "inline-block",
                      width: "2rem",
                      margin: "0 .5rem",
                      textAlign: "center",
                    }}
                  >
                    {limits.maxY}
                  </span>

                  <button onClick={(e) => updateLimits("maxY", 1)}>+</button>
                </div>
              </label>
            </div>
            <div className={styles.templateTiles}>
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
            <div className={styles.templateColors}>
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
            <div className={styles.actions}>
              <button onClick={removeSelectedDots}>Delete</button>
              <button onClick={() => rotateDot(1)}>Rotate</button>
              <button onClick={removeAllDots}>Reset</button>
            </div>
          </div>
          <div className={styles.loadOptions}>
            <button onClick={exportGrid}>Export</button>
            <button
              onClick={() =>
                openModal(
                  <div>
                    <input
                      id="file"
                      type="file"
                      onLoad={(e) => console.log(e)}
                    ></input>
                    <button
                      onClick={() => {
                        loadGrid();
                        hideModal();
                      }}
                    >
                      Load
                    </button>
                  </div>
                )
              }
            >
              Import
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default Controllers;
