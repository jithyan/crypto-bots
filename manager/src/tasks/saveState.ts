import fs from "fs";
import { botRegister } from "../models.js";

export const saveState = (): void => {
  fs.writeFileSync(
    "./botRegisterState.json",
    JSON.stringify(botRegister.state, null, 2),
    "utf8"
  );
};
