import { httpServer } from "./httpServer.js";

const port = Number(process.env.PORT ?? "2000");
const hostname = "0.0.0.0";

httpServer.listen(port, hostname, () => {
  console.log(`Listening on ${hostname}:${port}`);
});
