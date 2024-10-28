import User from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, location } = req.body;
    if (!name || !email || !location)
      res.json({ message: "all feilds are required" });

    const user = await User.create({
      name,
      email,
      followers: req.body.followers || [],
      following: req.body.following || [],
      location,
    });

    res.status(201).json({ user, message: "success" });
  } catch (error) {
    console.log("ERROR REGISTERING");
    console.log(error);
  }
};

export { registerUser };
