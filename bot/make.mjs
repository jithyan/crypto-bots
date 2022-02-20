#!/usr/bin/env zx
import "zx/globals";

const volatileList = (
  await question(
    "List all the volatile coin symbols (space separated) e.g. cvx eth: "
  )
)
  .split(" ")
  .filter(Boolean)
  .map((c) => c.trim().toUpperCase());

const stable = (await question("What's the stable coin symbol? "))
  .trim()
  .toUpperCase();
const cloudOrLocal = (await question("Build for cloud or local? ")).trim();

if (cloudOrLocal !== "cloud" && cloudOrLocal !== "local") {
  throw new Error(
    "Invalid answer: must be either cloud or local, not " + cloudOrLocal
  );
}

let dir = "bin/";
let filename = "";

await $`rm -rf ${dir}`;

const envsThatMustBeReplaced = new Set([
  "STABLE_COIN",
  "VOLATILE_COIN",
  "PORT",
]);

for (const volatile of volatileList) {
  const port = Math.trunc((Math.random() * 100_000 + 1025) % 65000);
  await $`mkdir -p ${dir}${volatile.toLowerCase()}${stable.toLowerCase()}/`;
  filename = `${port}_${volatile}${stable}_bot`.toLowerCase();
  const env = fs
    .readFileSync(`.${cloudOrLocal}.env`, "utf8")
    .split("\n")
    .filter(
      (envName) => !envsThatMustBeReplaced.has(envName) && Boolean(envName)
    )
    .concat([
      `STABLE_COIN=${stable}`,
      `VOLATILE_COIN=${volatile}`,
      `PORT=${port}`,
    ])
    .join("\n");

  console.log("Env", env);

  fs.writeFileSync("./.env", env, "utf8");

  if (cloudOrLocal === "cloud") {
    await $`yarn pkg:linux:cloud`;
  } else {
    await $`yarn pkg:linux:local`;
  }

  await $`mv dist/linux/bot ${dir}${volatile}${stable}/${filename}`;
  await $`chmod o+x ${dir}${volatile}${stable}/${filename}`;
}

if (cloudOrLocal === "cloud") {
  await $`gcloud compute scp --recurse ./bin/* jithya_n@instance-1:~/bots --zone=asia-northeast1-b`;

  console.log(chalk.cyan("Finished"));
}
