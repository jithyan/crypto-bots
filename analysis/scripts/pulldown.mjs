#!/usr/bin/env zx
import "zx/globals";

const symbol = (await question("What bot symbol you after? ")).trim();
const localdir = `./data/${symbol}`;
await $`mkdir ${localdir}`;

await $`gcloud compute scp --zone=asia-northeast1-b jithya_n@instance-1:~/bots/${symbol}/*.csv ${localdir}`;
await $`gcloud compute scp --zone=asia-northeast1-b jithya_n@instance-1:~/bots/${symbol}/*-api.log ${localdir}`;
await $`gcloud compute scp --zone=asia-northeast1-b jithya_n@instance-1:~/bots/${symbol}/*.csv.gz ${localdir}`;
await $`gcloud compute scp --zone=asia-northeast1-b jithya_n@instance-1:~/bots/${symbol}/*-api.log.gz ${localdir}`;

await $`gzip -d ${localdir}/*.gz`;
