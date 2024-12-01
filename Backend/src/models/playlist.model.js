import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const playlistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 50,
      unique: true,
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
playlistSchema.plugin(mongooseAggregatePaginate);
export const Playlist = model("Playlist", playlistSchema);
