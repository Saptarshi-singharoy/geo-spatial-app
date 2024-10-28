import express from "express";
import {
  getNearbyUsers,
  updateUserLocation,
} from "../controllers/location.controller.js";

const router = express.Router();

router.post("/get-users", getNearbyUsers);
router.post("/update-location", updateUserLocation);

export default router;
