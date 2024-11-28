import { Schema, model } from "mongoose";

const playlistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 50,
    },
    description: {
      type: String,
      trim: true,
      min: 10,
      max: 500,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    videoIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  { timestamps: true }
);

export const Playlist = model("Playlist", playlistSchema);
