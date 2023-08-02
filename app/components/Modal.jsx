"use client";

import React, { useContext } from "react";
import styles from "./Modal.module.scss";
import { ModalContext } from "../context/modal";

const Modal = () => {
  const { hideModal, content } = useContext(ModalContext);
  return (
    <div className={styles.modalBG}>
      <div className={styles.modalWrapper}>
        <button className={styles.closeButton} onClick={hideModal}>
          X
        </button>
        {content}
      </div>
    </div>
  );
};

export default Modal;
