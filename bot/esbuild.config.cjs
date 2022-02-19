const { build } = require("esbuild");
const revision =
  require("child_process")
    .execSync("git rev-parse HEAD")
    .toString()
    .trim()
    .slice(0, 7) || "";

const define = {
  "process.env.NODE_ENV": `"${process.env.NODE_ENV}"`,
  "process.env.APP_VERSION": `"${revision}"`,
  "process.env.BINANCE_KEY": `"${process.env.BINANCE_KEY}"`,
  "process.env.BINANCE_SECRET": `"${process.env.BINANCE_SECRET}"`,
  "process.env.STABLE_COIN": `"${process.env.STABLE_COIN}"`,
  "process.env.VOLATILE_COIN": `"${process.env.VOLATILE_COIN}"`,
  "process.env.EXCHANGE": `"${process.env.EXCHANGE}"`,
};

console.log("Starting build version", revision);
console.log("ENV", define);

build({
  entryPoints: ["./src/index.ts"],
  bundle: true,
  minify: true,
  outfile: "dist/index.js",
  platform: "node",
  target: "node17.4",
  treeShaking: true,
  // NOTE: Esbuild has a bug when outputting to ESM
  // Need to keep tabs on if it gets fixed
  // https://github.com/evanw/esbuild/issues/1921
  format: "cjs",
  define,
});
