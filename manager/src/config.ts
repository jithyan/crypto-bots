export const Config = {
  APP_VERSION: process.env.APP_VERSION ?? "not-set",
  PORT: Number(process.env.PORT ?? "2000"),
  BOT_DIR: process.env.BOT_DIR ?? "not-set",
};
