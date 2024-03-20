import mongoose from "mongoose";

const tweetSchema = mongoose.Schema(
  {
    description: {
      type: "String",
      required: true,
    },
    imageUrl: {
      type: "String",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: {
      type: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          comment: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const Tweet = mongoose.model("Tweet", tweetSchema);

export default Tweet;
