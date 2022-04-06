import { useState, useLayoutEffect } from "react";

export function useIsUpdatingOnChange<StrictEquality>(
  valueToWatch: StrictEquality,
  timeout: number = 3000
) {
  const [prevValue, setPrevValue] = useState(valueToWatch);

  useLayoutEffect(() => {
    if (prevValue !== valueToWatch) {
      const id = setTimeout(() => {
        setPrevValue(valueToWatch);
      }, timeout);

      return () => clearTimeout(id);
    }
  }, [valueToWatch]);

  return prevValue !== valueToWatch;
}
