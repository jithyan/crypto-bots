import { Server } from "socket.io";
import { httpServer } from "./httpServer";

const io = new Server(httpServer);
