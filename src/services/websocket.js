import { WebSocketServer } from "ws";
import User from "../models/user.model.js";
// let wss;

export function initializeWebSocket(server) {
  // Create a WebSocket server instance attached to the HTTP server
  const wss = new WebSocketServer({ server });

  // Handle WebSocket connection
  wss.on("connection", (ws) => {
    console.log("New client connected.");

    ws.on("message", async (message) => {
      try {
        const { userId, longitude, latitude } = JSON.parse(message);

        // Update user location in the database
        await User.findByIdAndUpdate(userId, {
          location: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
        });

        // Find nearby users and send response back
        const maxDistanceInRadians = 5 / 6378.1;
        const nearbyUsers = await User.find({
          location: {
            $geoWithin: {
              $centerSphere: [[longitude, latitude], maxDistanceInRadians],
            },
          },
        });

        ws.send(JSON.stringify({ nearbyUsers }));
      } catch (error) {
        console.error("Error processing message:", error);
        ws.send(JSON.stringify({ error: "Something went wrong" }));
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected.");
    });
  });

  return wss;
}
