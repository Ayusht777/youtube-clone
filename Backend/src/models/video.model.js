import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
  {
    videoFile: {
      url: {
        type: String, //cloudnary url
        required: true,
      },
      publicId: {
        type: String, //cloudnary url
        required: true,
      },
    },
    thumbnail: {
      url: {
        type: String, //cloudnary url
        required: true,
      },
      publicId: {
        type: String, //cloudnary url
        required: true,
      },
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim:true
    },
    duration: {
      type: Number,
      require: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
videoSchema.plugin(mongooseAggregatePaginate);
export const Video = model("Video", videoSchema);
