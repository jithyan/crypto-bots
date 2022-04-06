import cors from "cors";
import express from "express";
import helmet from "helmet";
import http from "http";

const app = express();
export const httpServer = http.createServer(app);

app.use(cors());
app.use(helmet());
app.use(express.json());
app.disable("x-powered-by");

app.post("");
