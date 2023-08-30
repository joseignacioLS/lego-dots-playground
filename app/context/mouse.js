"use client";

import { createContext, useState } from "react";
import { coordsToPosition, positionToCoords } from "../utils/space";

export const MouseContext = createContext(null);

export const MouseContextProvider = ({ children }) => {
  const [mousePosition, setMousePosition] = useState(undefined);
  const [mouseMovTime, setMouseMovTime] = useState(new Date());

  const updateMousePosition = (e, ref, dotSize) => {
    const timeDiff = new Date().getTime() - mouseMovTime.getTime();
    if (timeDiff < 25) return;
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
