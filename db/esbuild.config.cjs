const { build } = require("esbuild");
const revision =
  require("child_process")
    .execSync("git rev-parse HEAD")
    .toString()
    .trim()
    .slice(0, 7) || "";

const define = {
  "process.env.NODE_ENV": `"production"`,
  "process.env.APP_VERSION": `"${revision}"`,
  "process.env.BOT_DIR": `"${process.env.DB_USER}"`,
  "process.env.MGR_PASSWORD": `"${process.env.DB_PWD}"`,
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
