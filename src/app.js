import express from "express";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import nearbyRoute from "./routes/location.route.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cors());

app.use("/api/v1/users", userRoute);
app.use("/api/v1/location", nearbyRoute);

export default app;
