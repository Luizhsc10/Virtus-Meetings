import mongoose from "mongoose";
import FriendRequest from "../models/friendRequest.model.js";
import User from "../models/user.model.js";
import { io } from "../server.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { recipientId } = req.body;

    if (!recipientId) {
      return res.status(400).json({
        message: "Recipient ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      return res.status(400).json({
        message: "Invalid recipient ID",
      });
    }

    if (senderId.toString() === recipientId) {
      return res.status(400).json({
        message: "You cannot send a friend request to yourself",
      });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        message: "Recipient not found",
      });
    }

    const currentUser = await User.findById(senderId);
    if (!currentUser) {
      return res.status(404).json({
        message: "Current user not found",
      });
    }

    const friends = currentUser.friends || [];

    const isAlreadyFriend = friends.some(
      (friendId) => friendId.toString() === recipientId,
    );

    if (isAlreadyFriend) {
      return res.status(400).json({
        message: "You are already friends with this user",
      });
    }

    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      recipient: recipientId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Friend request already sent",
      });
    }

    const reverseRequest = await FriendRequest.findOne({
      sender: recipientId,
      recipient: senderId,
      status: "pending",
    });

    if (reverseRequest) {
      return res.status(400).json({
        message: "This user has already sent you a friend request",
      });
    }

    const friendRequest = await FriendRequest.create({
      sender: senderId,
      recipient: recipientId,
      status: "pending",
    });

    res.status(201).json({
      message: "Friend request sent successfully",
      friendRequest,
    });
  } catch (error) {
    console.error("Error in sendFriendRequest controller:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const incomingRequests = await FriendRequest.find({
      recipient: req.user._id,
      status: "pending",
    }).populate(
      "sender",
      "fullName email profilePic nativeLanguage learningLanguage location",
    );

    res.status(200).json({
      incomingRequests,
    });
  } catch (error) {
    console.error("Error in getFriendRequests controller:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        message: "Invalid request ID",
      });
    }

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({
        message: "Friend request not found",
      });
    }

    if (friendRequest.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to accept this request",
      });
    }

    if (friendRequest.status !== "pending") {
      return res.status(400).json({
        message: `Friend request already ${friendRequest.status}`,
      });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({
      message: "Friend request accepted successfully",
    });
  } catch (error) {
    console.error("Error in acceptFriendRequest controller:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        message: "Invalid request ID",
      });
    }

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({
        message: "Friend request not found",
      });
    }

    if (friendRequest.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to reject this request",
      });
    }

    if (friendRequest.status !== "pending") {
      return res.status(400).json({
        message: `Friend request already ${friendRequest.status}`,
      });
    }

    friendRequest.status = "rejected";
    await friendRequest.save();

    res.status(200).json({
      message: "Friend request rejected successfully",
    });
  } catch (error) {
    console.error("Error in rejectFriendRequest controller:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
