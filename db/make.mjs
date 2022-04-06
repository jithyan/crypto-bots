#!/usr/bin/env zx
import "zx/globals";

const dir = "dist/linux";
const filename = "db_service";

await $`rm -rf dist`;
await $`yarn pkg:linux`;
await $`chmod o+x ${dir}/${filename}`;
await $`gcloud compute scp ./dist/linux/db_service jithya_n@instance-1:~/db --zone=asia-northeast1-b`;

console.log(chalk.cyan("Finished"));
