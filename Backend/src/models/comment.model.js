import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      min: 10,
      max: 500,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    communityId: {
      type: Schema.Types.ObjectId,
      ref: "Community",
    },
    likeIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Like",
      },
    ],
    replyIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);
commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = model("Comment", commentSchema);
