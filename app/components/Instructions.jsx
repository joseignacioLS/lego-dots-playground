import React from "react";
import styles from "./Instructions.module.scss";

const Instructions = () => {
  return (
    <div>
      <h2 className={styles.title}>Keyboard Shortcuts</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Key</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>[e]</td>
            <td>Select Mode</td>
          </tr>
          <tr>
            <td>[a]</td>
            <td>Select All</td>
          </tr>
          <tr>
            <td>[f]</td>
            <td>Un select</td>
          </tr>
          <tr>
            <td>[q]</td>
            <td>Delete Selected Dots</td>
          </tr>
          <tr>
            <td>[w/r]</td>
            <td>Rotate (counter)clockwise</td>
          </tr>
          <tr>
            <td>[c]</td>
            <td>Copy Selected Dots</td>
          </tr>
          <tr>
            <td>[v]</td>
            <td>Paste Copied Dots</td>
          </tr>
          <tr>
            <td>[d]</td>
            <td>Toggle Prind Mode</td>
          </tr>
          <tr>
            <td>[s]</td>
            <td>Export</td>
          </tr>
          <tr>
            <td>arrows</td>
            <td>Move Selected Dots</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Instructions;
