import { Router } from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";
import { VerifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(VerifyJwt); // Apply verifyJWT middleware to all routes in this file

router
  .route("/subs/:channelId")
  .get(getSubscribedChannels)
  .post(toggleSubscription);

router.route("/u/:subscriberId").get(getUserChannelSubscribers);

export default router;
