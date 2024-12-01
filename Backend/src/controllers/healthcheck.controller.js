import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthcheck = asyncHandler(async (req, res) => {
  //TODO: build a healthcheck response that simply returns the OK status as json with a message
  return res
    .status(200)
    .json(new ApiResponse(200, {
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime:process.uptime(), //ist for sever running time (upto now)
        service:"youtube-clone-api",
        version:"1.0.0",
    }, "Healthcheck Successful"));
});

export { healthcheck };
