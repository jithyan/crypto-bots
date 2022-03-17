#!/usr/bin/env zx
import "zx/globals";

const dir = "dist/linux";
const filename = "manager";

await $`rm -rf dist`;
await $`yarn pkg:linux`;
await $`chmod o+x ${dir}/${filename}`;
await $`gcloud compute scp ./dist/linux/manager jithya_n@instance-1:~/bots --zone=asia-northeast1-b`;

console.log(chalk.cyan("Finished"));
