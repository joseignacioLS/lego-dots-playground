import React from "react";
import styles from "./dial.module.scss";

const Dial = ({
  value,
  leftBtnAction,
  rightBtnAction,
  onChange = () => {},
}) => {
  return (
    <div>
      <button onClick={leftBtnAction}>-</button>
      <input
        className={styles.input}
        value={value}
        onInput={(e) => {
          const value = e.currentTarget.value;
          if (!value.match(/^\-?[0-9]+$/)) return;
          onChange(+value);
        }}
      />

      <button onClick={rightBtnAction}>+</button>
    </div>
  );
};

export default Dial;
