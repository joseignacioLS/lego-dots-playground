"use client";

import { createContext, useEffect, useState } from "react";
import { coordsToPosition, positionToCoords } from "../utils/space";

export const MouseContext = createContext(null);

export const MouseContextProvider = ({ children }) => {
  const [mousePosition, setMousePosition] = useState(undefined);
  const [mouseMovTime, setMouseMovTime] = useState(new Date());
  const [mouseDrag, setMouseDrag] = useState([undefined, undefined]);
  const [isDragging, setIsDragging] = useState(false);

  const updateMousePosition = (e, ref, dotSize) => {
    const timeDiff = new Date().getTime() - mouseMovTime.getTime();
    if (timeDiff < 25) return;
    setMouseMovTime(new Date());
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const position = coordsToPosition(x, y, dotSize);
    const coords = positionToCoords(position[0], position[1], dotSize);
    setMousePosition(coords);
  };

  const setDragOrigin = () => {
    cleanDrag();
    setMouseDrag([[...mousePosition], undefined]);
  };

  const cleanDrag = () => {
    setMouseDrag([undefined, undefined]);
    setIsDragging(false);
  };

  useEffect(() => {
    if (mouseDrag[0] === undefined) return;
    setIsDragging(true);
    setMouseDrag((old) => {
      return [[...old[0]], [...mousePosition]];
    });
  }, [mousePosition]);

  return (
    <MouseContext.Provider
      value={{
        mousePosition,
        updateMousePosition,
        mouseDrag,
        setDragOrigin,
        cleanDrag,
        isDragging,
      }}
    >
      {children}
    </MouseContext.Provider>
  );
};
