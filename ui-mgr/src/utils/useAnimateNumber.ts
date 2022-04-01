import Big from "big.js";
import { useState, useEffect } from "react";
//@ts-ignore
import { startTransition } from "react";

export function useAnimateNumber(
  num: string,
  round: number,
  { steps = 10, ms = 250 }: { steps?: number; ms?: number } = {}
) {
  const [currentNum, setCurrentNum] = useState<string>(
    new Big(num).round(round).toString()
  );

  useEffect(() => {
    const newNumRounded = new Big(num).round(round).toString();

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
                  new Big(prev).add(increment).round(round).toString()
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
