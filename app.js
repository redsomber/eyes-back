import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { createServer } from "http";
import router from "./routers/crudRouters.js";
import { setupSocket } from "./controllers/sockets.js";

dotenv.config();

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "https://dojoproject-6653a.web.app/",
  })
);
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "https://dojoproject-6653a.web.app/" } });

// Set up socket connection
setupSocket(io);

app.use(router);

app.set("port", process.env.PORT || 5000);

httpServer.listen(app.get("port"), function () {
  const port = httpServer.address().port;
  console.log("Running on : ", port);
});
