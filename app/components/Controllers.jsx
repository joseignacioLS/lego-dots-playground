import React, { useContext, useEffect } from "react";
import styles from "./Controllers.module.scss";
import Dot from "./Dot";
import { ModalContext } from "../context/modal";
import { colors } from "../data/data";
import { curveCorner, digglet, rectangle, square } from "../data/dots";

const Controllers = ({
  templateTile,
  setTemplateTile,
  size,
  handleSizeChange,
  dotSize,
  handleDotSizeChange,
  color,
  setColor,
  deleteDot,
  loadGrid,
  exportGrid,
  printMode,
  setPrintMode,
}) => {
  const { openModal, hideModal } = useContext(ModalContext);

  useEffect(() => {
    setColor(colors[0]);
  }, []);

  return (
    <section className={styles.controls}>
      <label>
        <input
          type="checkbox"
          onChange={(e) => setPrintMode(e.currentTarget.checked)}
        ></input>
        Print Mode
      </label>
      {!printMode && (
        <>
          <div className={styles.managing}>
            <label className={styles.labelAndButtons}>
              Board Size
              <div>
                <button onClick={(e) => handleSizeChange(size - 1)}>-</button>
                <span
                  style={{
                    display: "inline-block",
                    width: "2rem",
                    margin: "0 .5rem",
                    textAlign: "center",
                  }}
                >
                  {size}
                </span>
                <button onClick={(e) => handleSizeChange(size + 1)}>+</button>
              </div>
            </label>
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
            <div className={styles.templateTiles}>
              <div
                className={`${styles.cell} ${
                  templateTile === undefined && styles.cellSelected
                }`}
                onClick={() => setTemplateTile(undefined)}
              >
                👆
              </div>
              {[square, curveCorner, rectangle, digglet].map((template, i) => {
                return (
                  <div
                    key={i}
                    className={`${styles.cell} ${
                      templateTile === i && styles.cellSelected
                    }`}
                    style={{ border: "1px solid black" }}
                    onClick={() => setTemplateTile(template)}
                  >
                    {i}
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
                      setColor(ccolor);
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
              <button onClick={deleteDot}>Delete</button>
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
