"use client";

import { createContext, useState } from "react";

export const ModalContext = createContext(null);

export const ModalContextProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState(undefined);
  const hideModal = () => {
    setIsVisible(false);
    setContent(undefined);
  };
  const openModal = (newContent) => {
    setIsVisible(true);
    setContent(newContent);
  };
  return (
    <ModalContext.Provider value={{ isVisible, hideModal, content, openModal }}>
      {children}
    </ModalContext.Provider>
  );
};
