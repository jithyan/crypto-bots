const { build } = require("esbuild");
const revision =
  require("child_process")
    .execSync("git rev-parse HEAD")
    .toString()
    .trim()
    .slice(0, 7) || "";

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
  define: {
    "process.env.NODE_ENV": '"production"',
    "process.env.APP_VERSION": `"${revision}"`,
    "process.env.BINANCE_KEY": `"${process.env.BINANCE_KEY}"`,
    "process.env.BINANCE_SECRET": `"${process.env.BINANCE_SECRET}"`,
  },
});
