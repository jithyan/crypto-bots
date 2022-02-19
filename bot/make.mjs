#!/usr/bin/env zx
import "zx/globals";

const volatile = (await question("What's the volatile coin symbol? "))
  .trim()
  .toUpperCase();
const stable = (await question("What's the stable coin symbol? "))
  .trim()
  .toUpperCase();
const cloudOrLocal = (await question("Build for cloud or local? ")).trim();

if (cloudOrLocal !== "cloud" && cloudOrLocal !== "local") {
  throw new Error(
    "Invalid answer: must be either cloud or local, not " + cloudOrLocal
  );
}

const filename = `${volatile}${stable}_bot`.toLowerCase();
const env = fs
  .readFileSync(`.${cloudOrLocal}.env`, "utf8")
  .split("\n")
  .filter(
    (v) =>
      !v.startsWith("STABLE_COIN") ||
      !v.startsWith("VOLATILE_COIN") ||
      !Boolean(v)
  )
  .concat([`STABLE_COIN=${stable}`, `VOLATILE_COIN=${volatile}`])
  .join("\n");

console.log("Env", env);

fs.writeFileSync("./.env", env, "utf8");

if (cloudOrLocal === "cloud") {
  await $`yarn pkg:linux:cloud`;
} else {
  await $`yarn pkg:linux:local`;
}
const dir = `bin`;
await $`rm -rf ${dir}`;
await $`mkdir -p ${dir}`;
await $`mv dist/linux/bot ${dir}/${filename}`;

if (cloudOrLocal === "cloud") {
  await $`gcloud compute scp ./bot/bin/${dir}/${filename} jithya_n@instance-1:~/bots`;
}
