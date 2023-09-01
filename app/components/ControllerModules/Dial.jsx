import React from "react";

const Dial = ({ value, leftBtnAction, rightBtnAction }) => {
  return (
    <div>
      <button onClick={leftBtnAction}>-</button>
      <span
        style={{
          display: "inline-block",
          width: "2rem",
          margin: "0 .5rem",
          textAlign: "center",
        }}
      >
        {value}
      </span>

      <button onClick={rightBtnAction}>+</button>
    </div>
  );
};

export default Dial;
