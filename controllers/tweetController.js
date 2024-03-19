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

export { createTweet, deleteTweet };