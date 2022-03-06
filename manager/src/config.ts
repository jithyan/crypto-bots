export const Config = {
  APP_VERSION: process.env.APP_VERSION?.trim() ?? "not-set",
  PORT: Number(process.env.PORT?.trim() ?? "2000"),
  BOT_DIR: process.env.BOT_DIR?.trim() ?? "not-set",
  PASSWORD: process.env.MGR_PASSWORD?.trim() ?? "not-set",
};
