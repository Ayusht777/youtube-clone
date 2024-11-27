import { Router } from "express";
import {
  getSubscribedChannels,
  getChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";
import { VerifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(VerifyJwt); // Apply verifyJWT middleware to all routes in this file

router
  .route("/subs/:channelId")
  .get(getChannelSubscribers)
  .post(toggleSubscription);

router.route("/subscibedChannels/:subscriberId").get(getSubscribedChannels);

export default router;
