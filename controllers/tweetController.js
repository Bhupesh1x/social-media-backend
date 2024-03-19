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

export { createTweet };
