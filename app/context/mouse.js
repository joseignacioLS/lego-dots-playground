"use client";

import { createContext, useContext, useState } from "react";
import { CanvasContext } from "./canvas";
import { coordsToPosition, positionToCoords } from "../utils/space";

export const MouseContext = createContext(null);

export const MouseContextProvider = ({ children }) => {
  const [mousePosition, setMousePosition] = useState([0, 0]);
  const [mouseMovTime, setMouseMovTime] = useState(new Date());

  const updateMousePosition = (e, ref, dotSize) => {
    const timeDiff = new Date().getTime() - mouseMovTime.getTime();
    if (timeDiff < 10) return;
    setMouseMovTime(new Date());
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const position = coordsToPosition(x, y, dotSize);
    const coords = positionToCoords(...position, dotSize);
    setMousePosition(coords);
  };

  return (
    <MouseContext.Provider value={{ mousePosition, updateMousePosition }}>
      {children}
    </MouseContext.Provider>
  );
};
