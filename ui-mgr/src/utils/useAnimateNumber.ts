import Big from "big.js";
import { useState, useEffect, startTransition } from "react";

export function useAnimateNumber(
  num: string,
  round: number,
  { steps = 25, ms = 100 }: { steps?: number; ms?: number } = {}
) {
  const [currentNum, setCurrentNum] = useState<string>(
    new Big(num).toFixed(round)
  );

  useEffect(() => {
    const newNumRounded = new Big(num).toFixed(round);

    if (newNumRounded !== currentNum) {
      const timeoutIds: number[] = [];

      const difference = new Big(num).minus(currentNum);
      const increment = difference.div(steps).round(round);

      if (!increment.eq("0")) {
        let numSteps = difference
          .div(increment)
          .round(0, Big.roundDown)
          .toNumber();
        numSteps = numSteps < 0 ? numSteps * -1 : numSteps;

        for (let i = 0; i < numSteps; i++) {
          timeoutIds.push(
            setTimeout(() => {
              startTransition(() => {
                setCurrentNum((prev) =>
                  new Big(prev).add(increment).toFixed(round)
                );
              });
            }, ms * i)
          );
        }

        timeoutIds.push(
          setTimeout(() => {
            startTransition(() => {
              setCurrentNum(() => newNumRounded);
            });
          }, ms * numSteps)
        );

        return () => timeoutIds.forEach((id) => clearTimeout(id));
      }
    }
  }, [num]);

  return currentNum;
}
