#!/usr/bin/env zx
import "zx/globals";

const dir = "dist/linux";
const filename = "db";

await $`rm -rf dist`;
await $`yarn pkg:linux`;
await $`chmod o+x ${dir}/${filename}`;
await $`gcloud compute scp ./${dir}/${filename} jithya_n@instance-1:~/db --zone=asia-northeast1-b`;

console.log(chalk.cyan("Finished"));
