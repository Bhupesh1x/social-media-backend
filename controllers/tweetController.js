import User from "../modals/userModal.js";
import Tweet from "../modals/tweetSchema.js";

const createTweet = async (req, res) => {
  try {
    const userId = req.user;
    const { description, imageUrl } = req.body;

    if (!userId || !description.trim().length) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
      });
    }

    const tweet = await Tweet.create({
      userId,
      description,
      imageUrl: imageUrl || undefined,
    });

    res.json(tweet);
  } catch (error) {
    console.log("createTweet error", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

const deleteTweet = async (req, res) => {
  try {
    const { id } = req.params;

    const tweet = await Tweet.deleteOne({
      $and: [{ _id: id }, { userId: req.user }],
    });

    if (!tweet?.deletedCount) {
      return res.status(500).json({
        message: "It is not authorized for you to remove this tweet.",
        success: false,
      });
    }

    res.json({
      message: "Tweet deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log("deleteTweet error", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

const likeOrDislike = async (req, res) => {
  try {
    const userId = req.user;
    const { id } = req.params;

    const tweet = await Tweet.findById(id);

    if (!tweet) {
      return res.status(400).send({
        message: "Invalid tweet id",
        success: false,
      });
    }

    if (tweet.likes.includes(userId)) {
      await Tweet.findByIdAndUpdate(id, { $pull: { likes: userId } });
      return res.send({
        message: "Tweet disliked successfully",
        success: true,
      });
    } else {
      await Tweet.findByIdAndUpdate(id, { $push: { likes: userId } });
      return res.send({
        message: "Tweet liked successfully",
        success: true,
      });
    }
  } catch (error) {
    console.log("likeOrDislike error", error);
    return res.status(500).send({
      message: "Something went wrong",
      success: false,
    });
  }
};

const addComment = async (req, res) => {
  try {
    const { tweetId, comment } = req.body;
    const userId = req.user;

    const tweet = await Tweet.findByIdAndUpdate(
      tweetId,
      {
        $push: { comments: { userId, comment } },
      },
      { new: true }
    );

    if (!tweet) {
      return res.status(400).send({
        message: "Invalid tweet id",
        success: false,
      });
    }

    return res.json(tweet);
  } catch (error) {
    console.log("addComment error", error);
    return res.status(500).send({
      message: "Something went wrong",
      success: false,
    });
  }
};

const getAllTweets = async (req, res) => {
  try {
    const userId = req.user;

    const user = await User.findById(userId);

    const userTweets = await Tweet.find({ userId }).populate("userId");

    const followingTweets = await Promise.all(
      user.following.map((userId) => {
        return Tweet.find({ userId }).populate("userId");
      })
    );

    const allTweets = userTweets.concat(...followingTweets);

    return res.json(allTweets);
  } catch (error) {
    console.log("getAllTweets error", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: 500,
    });
  }
};

const getTweetById = async (req, res) => {
  try {
    const { id } = req.params;

    const tweet = await Tweet.findById(id).populate("userId comments.userId");

    if (!tweet) {
      return res.status(400).json({
        message: "Tweet not found with the particular id",
        success: false,
      });
    }

    return res.json(tweet);
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

export {
  createTweet,
  deleteTweet,
  likeOrDislike,
  addComment,
  getAllTweets,
  getTweetById,
};
