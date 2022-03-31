import { useState, useLayoutEffect } from "react";

export function useUpdateStyleOnCheckIn(
  lastCheckIn: string,
  { normalStyle, updatedStyle }: { normalStyle: string; updatedStyle: string }
) {
  const [style, setStyle] = useState(normalStyle);
  const [prevKnownCheckIn, setPrevKnownCheckIn] = useState(lastCheckIn);

  useLayoutEffect(() => {
    if (prevKnownCheckIn !== lastCheckIn) {
      setStyle(() => updatedStyle);
      setPrevKnownCheckIn(lastCheckIn);
    }
    const id = setTimeout(() => {
      setStyle(() => normalStyle);
    }, 3000);
    return () => clearTimeout(id);
  }, [lastCheckIn]);

  return style;
}
