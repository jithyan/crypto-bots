#!/usr/bin/env zx
import "zx/globals";
import { h32 } from "xxhashjs";
const SEED = 2048;

function parseConfig() {
  const config = JSON.parse(fs.readFileSync("./botConfig.json", "utf8"));
  const skipped = [];
  Object.keys(config).forEach((key) => {
    if (config[key].skip === true) {
      skipped.push(key);
      delete config[key];
    } else {
      delete config[key].skip;
    }
  });

  console.log(`Found ${Object.keys(config).length} bots to build`);
  console.log(`${skipped.length} skipped: `, skipped);

  return config;
}

function parseCloudEnvFile() {
  return fs
    .readFileSync(`.cloud.env`, "utf8")
    .split("\n")
    .filter((envLine) => Boolean(envLine));
}

function mergeCloudEnvWithConfigEnv(configForSymbol, port) {
  const configEnvs = new Set(Object.keys(configForSymbol));
  const configEnvLines = Object.keys(configForSymbol).map(
    (key) => `${key}=${configForSymbol[key]}`
  );
  const cloudEnvLines = parseCloudEnvFile(configForSymbol);

  return cloudEnvLines
    .filter(
      (envLine) => Boolean(envLine) && !configEnvs.has(envLine.split("=")[0])
    )
    .concat(configEnvLines)
    .concat([`PORT=${port}`])
    .join("\n");
}

async function buildFromConfig() {
  const config = parseConfig();

  const buildBotAsyncFns = Object.keys(config).map((key) => async () => {
    const port =
      (h32(
        [
          config[key]["VOLATILE_COIN"],
          config[key]["STABLE_COIN"],
          "binance",
        ].join(":"),
        SEED
      ).toNumber() %
        65000) +
      1025;

    await $`mkdir -p bin/${key.toLowerCase()}/`;
    const filename = `${port}_${key}_bot`.toLowerCase();

    const env = mergeCloudEnvWithConfigEnv(config[key], port);
    fs.writeFileSync("./.env", env, "utf8");
    await $`yarn pkg:linux:cloud`;
    await $`mv dist/linux/bot bin/${key}/${filename}`;
    await $`chmod o+x bin/${key}/${filename}`;
  });

  let count = 0;
  const logBotBuilt = () => {
    console.log(chalk.yellow(`Finished building bot ${++count}`));
  };

  await buildBotAsyncFns.reduce(
    (acc, fn) => acc.then(fn).then(logBotBuilt),
    Promise.resolve()
  );

  await $`gcloud compute scp --recurse ./bin/* jithya_n@instance-1:~/bots --zone=asia-northeast1-b`;

  console.log(chalk.cyan("Finished"));
}

const shouldBuildFromConfig = (await question("Build from config? (y/n)"))
  .toLowerCase()
  .startsWith("y");

if (shouldBuildFromConfig) {
  buildFromConfig();
} else {
  oldFlow();
}

async function oldFlow() {
  const volatileListRaw = (
    await question(
      "List all the volatile coin symbols (space separated) e.g. cvx eth: "
    )
  )
    .split(" ")
    .filter(Boolean)
    .map((c) => c.trim().toUpperCase());
  const volatileList = Array.from(new Set(volatileListRaw));

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
    const port =
      (h32([volatile, stable, "binance"].join(":"), SEED).toNumber() % 65000) +
      1025;
    await $`mkdir -p ${dir}${volatile.toLowerCase()}${stable.toLowerCase()}/`;
    filename = `${port}_${volatile}${stable}_bot`.toLowerCase();
    const env = fs
      .readFileSync(`.${cloudOrLocal}.env`, "utf8")
      .split("\n")
      .filter(
        (envLine) =>
          Boolean(envLine) && !envsThatMustBeReplaced.has(envLine.split("=")[0])
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
}
