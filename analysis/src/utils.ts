import fs from "fs";

export function getTodayInLogDateFormat() {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm: number | string = today.getMonth() + 1; // Months start at 0!
  let dd: number | string = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  return yyyy + "-" + mm + "-" + dd;
}

export function getFilesInDir(dir: string): string[] {
  const filenames = fs.readdirSync(dir);
  return filenames.map((fn) => `${dir}/${fn}`);
}
