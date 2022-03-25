import "zx/globals";
import fs from "fs";

const botConfig = JSON.parse(fs.readFileSync("../bot/botConfig.json", "utf8"));
const symbols = Object.keys(botConfig);

for await (const i of downloadCsv(symbols)) {
  console.log(`Downloaded ${i + 1} of ${symbols.length}`);
}

async function* downloadCsv(symbols) {
  let i = 0;
  for (const symbol of symbols) {
    const localdir = `./data/${symbol}`;
    await $`mkdir -p ${localdir}`;
    await $`gcloud compute scp --zone=asia-northeast1-b jithya_n@instance-1:~/bots/${symbol}/*.cs* ${localdir}`;
    await $`cp ./data/empty.txt.gz ${localdir}`;
    await $`gzip -d ${localdir}/*.gz`;
    await $`rm -rf ${localdir}/*.txt`;
    yield i;
    i++;
  }
}
