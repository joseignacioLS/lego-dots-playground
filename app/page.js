"use client";

import { useContext } from "react";
import styles from "./page.module.scss";
import Controllers from "./components/Controllers";
import { ModalContext } from "./context/modal";
import Modal from "./components/Modal";
import Instructions from "./components/Instructions";
import Canvas from "./components/Canvas";

export default function Home() {
  const { isVisible, openModal } = useContext(ModalContext);

  return (
    <main className={styles.main}>
      <h1>
        Lego Dots Playground DEVELOP
        <span onClick={() => openModal(<Instructions />)}>💡</span>
      </h1>
      <Canvas />
      <Controllers />
      {isVisible && <Modal></Modal>}
    </main>
  );
}
