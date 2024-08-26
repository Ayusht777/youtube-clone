import { Schema, model } from "mongoose";
const subscriptionSchema = new Schema(
  {
    subscriber: {
      Type: Schema.Types.ObjectId,
      ref: "User",
    },
    channel: {
      Type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Subscription = model("subscription", subscriptionSchema);
