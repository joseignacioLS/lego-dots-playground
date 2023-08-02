import React from "react";

const Instructions = () => {
  return (
    <div>
      <h2>Instructions!</h2>
      <p>
        <b>Select the Dot</b> you want to place and{" "}
        <b>click on the board to place it.</b>
      </p>
      <em>
        Tip: Fast select the Dot using 1, 2, 3 and 4 in your keyboard, of E for
        the hand.
      </em>
      <p>
        Use the <b>W and R keys to rotate</b> the selected position (highlighted
        in red)
      </p>
      <p>
        Use the <b>Q key to remove</b> the Dot in the selected position
      </p>
    </div>
  );
};

export default Instructions;
