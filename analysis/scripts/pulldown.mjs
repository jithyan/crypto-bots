#!/usr/bin/env zx
import "zx/globals";

const symbol = (await question("What bot symbol you after? ")).trim();
const localdir = `./data/${symbol}`;
await $`mkdir ${localdir}`;

if (symbol === "pricebot") {
  await $`gcloud compute scp --zone=asia-northeast1-b jithya_n@instance-1:~/bots/${symbol}/*-api.lo* ${localdir}`;
} else {
  await $`gcloud compute scp --zone=asia-northeast1-b jithya_n@instance-1:~/bots/${symbol}/*.cs* ${localdir}`;
  await $`gcloud compute scp --zone=asia-northeast1-b jithya_n@instance-1:~/bots/${symbol}/*-api.lo* ${localdir}`;
}

await $`gzip -d ${localdir}/*.gz`;
