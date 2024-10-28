import User from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getNearbyUsers = async (req, res) => {
  console.log("API TRIGGERED!!!");
  console.log(req.body.latitude, req.body.longitude);

  try {
    const { longitude, latitude } = req.body;

    const parsedLongitude = parseFloat(longitude);
    const parsedLatitude = parseFloat(latitude);

    if (!longitude || !latitude)
      return res
        .status(400)
        .json(new ApiError(400, "Latitude and longitude are required"));

    const radiusInKm = 5;
    const earthRadiusInKm = 6378.1;

    // Perform the $geoWithin query with $centerSphere
    const nearbyUsers = await User.find({
      location: {
        $geoWithin: {
          $centerSphere: [
            [parsedLongitude, parsedLatitude],
            radiusInKm / earthRadiusInKm,
          ],
        },
      },
    }).select("name email");

    console.log(nearbyUsers);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          nearbyUsers,
          "fetched nearby users withing 5KM Radius"
        )
      );
  } catch (error) {
    res.json({ error });
  }
};

const updateUserLocation = async (req, res) => {
  try {
    let { longitude, latitude, email } = req.body;

    if (!longitude || !latitude)
      res.json({ message: "all feilds are required" });

    // longitude = parseFloat(longitude).toFixed(6);
    // latitude = parseFloat(latitude).toFixed(6);

    const user = await User.findOneAndUpdate(
      { email },
      { $set: { "location.coordinates": [longitude, latitude] } },
      { new: true }
    ).select("name location");

    // console.log(user);

    if (!user) {
      console.log("HIIIIII");
      console.log(user);
      // res
      //   .status(500)
      //   .json(new ApiError(500, "something went wrong fetching user"));
    }

    res.status(200).json(new ApiResponse(200, user, "coordinates updated"));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError(500, "something went wrong", error));
  }
};

export { getNearbyUsers, updateUserLocation };
