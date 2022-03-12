import { writeApiPricesForSymbol } from "./parse/api";
import { startSimulations } from "./simulation";
import fs from "fs";
import es from "event-stream";

import { readFile, writeFile } from "@rxnode/fs";
import { switchMap } from "rxjs/operators";

readFile("src/some-file.js")
  .pipe(switchMap((data) => writeFile("src/some-file.js", data)))
  .subscribe({
    complete() {
      console.log("Complete!");
    },
  });
// writeApiPricesForSymbol("lunabusd");

// console.time("simul");
// startSimulations(2, "luna").then((res) => {
//   console.timeLog("simul", res[0]);
//   console.timeEnd("simul");
// });
