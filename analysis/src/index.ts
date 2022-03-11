import { startSimulations } from "./simulation";

console.time("simul");
startSimulations("eth").then((res) => {
  console.timeLog("simul", res[0]);
  console.timeEnd("simul");
});
