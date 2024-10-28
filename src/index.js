import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import { initializeWebSocket } from "./services/websocket.js";

dotenv.config();

const server = http.createServer(app);
initializeWebSocket(server);

(() => {
  try {
    const connectionInstance = mongoose.connect(process.env.MONGO_URL);
    console.log(`Mongo DB server connected with host`);
    // console.log(connectionInstance.then((res) => console.log(res)));
    server.listen(process.env.PORT, () => {
      console.log("App running on server 3000");
    });
  } catch (error) {
    console.log("Failed to connect to database", error);
  }
})();
