import React, { useContext } from "react";
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
import { CanvasContext } from "../context/canvas";
import Dial from "./ControllerModules/Dial";
import TemplatesBar from "./ControllerModules/TemplatesBar";
import ColorBar from "./ControllerModules/ColorBar";

const templates = [square, curveCorner, digglet, circle, rectangle, curve3x3];

const Controllers = ({}) => {
  const { openModal, hideModal } = useContext(ModalContext);
  const {
    removeAllDots,
    removeSelectedDots,
    handleDotSizeChange,
    printMode,
    background,
    setBackground,
    imageFilter,
    setImageFilter,
    dotSize,
    exportGrid,
    loadGrid,
    setPrintMode,
    limits,
    updateLimits,
  } = useContext(CanvasContext);

  const openImportModal = () => {
    openModal(
      <div>
        <input
          id="file"
          type="file"
          onChange={(e) => {
            loadGrid();
            hideModal();
          }}
        ></input>
      </div>
    );
  };

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
      {printMode && (
        <label>
          <input
            type="checkbox"
            checked={background}
            onChange={(e) => setBackground(e.currentTarget.checked)}
          ></input>
          Background
        </label>
      )}
      {printMode && (
        <label>
          <input
            type="checkbox"
            checked={imageFilter}
            onChange={(e) => setImageFilter(e.currentTarget.checked)}
          ></input>
          Filter
        </label>
      )}
      {!printMode && (
        <>
          <div className={styles.managing}>
            <label className={styles.labelAndButtons}>
              Dot Size
              <Dial
                value={dotSize}
                leftBtnAction={() => handleDotSizeChange(dotSize - 4)}
                rightBtnAction={() => handleDotSizeChange(dotSize + 4)}
              ></Dial>
            </label>
            <div className={styles.oneLine}>
              <label className={styles.labelAndButtons}>
                Left Limit
                <Dial
                  value={limits.minX}
                  leftBtnAction={() => updateLimits("minX", -1)}
                  rightBtnAction={() => updateLimits("minX", 1)}
                ></Dial>
              </label>
              <label className={styles.labelAndButtons}>
                Right Limit
                <Dial
                  value={limits.maxX}
                  leftBtnAction={() => updateLimits("maxX", -1)}
                  rightBtnAction={() => updateLimits("maxX", 1)}
                ></Dial>
              </label>
            </div>
            <div className={styles.oneLine}>
              <label className={styles.labelAndButtons}>
                Top Limit
                <Dial
                  value={limits.minY}
                  leftBtnAction={() => updateLimits("minY", -1)}
                  rightBtnAction={() => updateLimits("minY", 1)}
                ></Dial>
              </label>
              <label className={styles.labelAndButtons}>
                Bottom Limit
                <Dial
                  value={limits.maxY}
                  leftBtnAction={() => updateLimits("maxY", -1)}
                  rightBtnAction={() => updateLimits("maxY", 1)}
                ></Dial>
              </label>
            </div>
            <TemplatesBar templates={templates} />
            <ColorBar colors={colors}></ColorBar>
            <div className={styles.actions}>
              <button onClick={removeSelectedDots}>Delete</button>
              <button onClick={() => rotateDot(1)}>Rotate</button>
              <button onClick={removeAllDots}>Reset</button>
            </div>
          </div>
          <div className={styles.loadOptions}>
            <button onClick={exportGrid}>Export</button>
            <button onClick={openImportModal}>Import</button>
          </div>
        </>
      )}
    </section>
  );
};

export default Controllers;
