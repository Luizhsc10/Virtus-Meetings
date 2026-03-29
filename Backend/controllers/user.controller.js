import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    console.error("Error in getCurrentUser controller:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const onboardUser = async (req, res) => {
  try {
    const {
      fullName,
      bio,
      nativeLanguage,
      learningLanguage,
      location,
      profilePic,
    } = req.body;

    const finalFullName = (fullName || req.user.fullName || "").trim();
    const finalBio = (bio || "").trim();
    const finalNativeLanguage = (nativeLanguage || "").trim();
    const finalLearningLanguage = (learningLanguage || "").trim();
    const finalLocation = (location || "").trim();
    const finalProfilePic = (profilePic || "").trim();

    if (
      !finalFullName ||
      !finalBio ||
      !finalNativeLanguage ||
      !finalLearningLanguage ||
      !finalLocation
    ) {
      return res.status(400).json({
        message: "All onboarding fields are required",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        fullName: finalFullName,
        bio: finalBio,
        nativeLanguage: finalNativeLanguage,
        learningLanguage: finalLearningLanguage,
        location: finalLocation,
        profilePic: finalProfilePic,
        isOnboarded: true,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Onboarding completed successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in onboardUser controller:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const discoverUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const friendIds = req.user.friends || [];

    const excludedUserIds = [currentUserId, ...friendIds];

    const users = await User.find({
      _id: { $nin: excludedUserIds },
      isOnboarded: true,
    }).select("-password");

    res.status(200).json({
      users,
    });
  } catch (error) {
    console.error("Error in discoverUsers controller:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate(
        "friends",
        "fullName email profilePic nativeLanguage learningLanguage location bio isOnboarded",
      )
      .select("friends");

    res.status(200).json({
      friends: user.friends,
    });
  } catch (error) {
    console.error("Error in getUserFriends controller:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
