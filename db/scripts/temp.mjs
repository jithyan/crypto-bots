import "zx/globals";
import fs from "fs";

function getFilesInDir(dir) {
  const filenames = fs.readdirSync(dir);
  return filenames.map((fn) => `${dir}/${fn}`);
}

const folders = getFilesInDir("./data/bots");

await run();
console.log("Finished");

async function run() {
  const promises = folders.map(async (folder) => {
    console.log("Working on", folder);

    const files = getFilesInDir(folder);
    const filesToRemove = files.filter((file) => {
      const remove = !file.endsWith(".csv") && !file.endsWith(".csv.gz");
      console.log(file, remove);
      return remove;
    });
    filesToRemove.forEach((fn) => fs.unlinkSync(fn));

    console.log("Removed", folder);
    return $`gzip -d ${folder}/*.gz`;
  });
  await Promise.all(promises);
}
