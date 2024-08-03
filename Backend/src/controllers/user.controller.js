import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (_req, res) => {
  res.status(200).json({ message: "ok" });
});

export { registerUser };
