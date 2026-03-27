import mongoose from "mongoose";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { io } from "../server.js";

export const getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate(
        "participants",
        "fullName email profilePic nativeLanguage learningLanguage location",
      )
      .sort({ updatedAt: -1 });

    const conversationPreviews = await Promise.all(
      conversations.map(async (conversation) => {
        const lastMessage = await Message.findOne({
          conversationId: conversation._id,
        })
          .sort({ createdAt: -1 })
          .populate("sender", "fullName email profilePic");

        const unreadCount = await Message.countDocuments({
          conversationId: conversation._id,
          sender: { $ne: req.user._id },
          readBy: { $ne: req.user._id },
        });

        const otherParticipant = conversation.participants.find(
          (participant) =>
            participant._id.toString() !== req.user._id.toString(),
        );

        return {
          _id: conversation._id,
          participants: conversation.participants,
          otherParticipant,
          lastMessage: lastMessage
            ? {
                _id: lastMessage._id,
                text: lastMessage.text,
                sender: lastMessage.sender,
                createdAt: lastMessage.createdAt,
              }
            : null,
          unreadCount,
          updatedAt: conversation.updatedAt,
          createdAt: conversation.createdAt,
        };
      }),
    );

    res.status(200).json({
      conversations: conversationPreviews,
    });
  } catch (error) {
    console.error("Error in getUserConversations controller:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const createOrGetConversation = async (req, res) => {
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
        message: "You cannot create a conversation with yourself",
      });
    }

    const currentUser = await User.findById(senderId);
    if (!currentUser) {
      return res.status(404).json({
        message: "Current user not found",
      });
    }

    const isFriend = (currentUser.friends || []).some(
      (friendId) => friendId.toString() === recipientId,
    );

    if (!isFriend) {
      return res.status(403).json({
        message: "You can only start conversations with friends",
      });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId], $size: 2 },
    }).populate(
      "participants",
      "fullName email profilePic nativeLanguage learningLanguage location",
    );

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, recipientId],
      });

      conversation = await Conversation.findById(conversation._id).populate(
        "participants",
        "fullName email profilePic nativeLanguage learningLanguage location",
      );
    }

    res.status(200).json({
      conversation,
    });
  } catch (error) {
    console.error(
      "Error in createOrGetConversation controller:",
      error.message,
    );
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        message: "Invalid conversation ID",
      });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    const isParticipant = conversation.participants.some(
      (participantId) => participantId.toString() === req.user._id.toString(),
    );

    if (!isParticipant) {
      return res.status(403).json({
        message: "You are not authorized to view these messages",
      });
    }

    const messages = await Message.find({ conversationId })
      .populate("sender", "fullName email profilePic")
      .sort({ createdAt: 1 });

    res.status(200).json({
      messages,
    });
  } catch (error) {
    console.error("Error in getMessages controller:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        message: "Invalid conversation ID",
      });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Message text is required",
      });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    const isParticipant = conversation.participants.some(
      (participantId) => participantId.toString() === req.user._id.toString(),
    );

    if (!isParticipant) {
      return res.status(403).json({
        message: "You are not authorized to send messages in this conversation",
      });
    }

    const message = await Message.create({
      conversationId,
      sender: req.user._id,
      text: text.trim(),
      readBy: [req.user._id],
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      $set: { updatedAt: new Date() },
    });

    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "fullName email profilePic",
    );

    io.to(conversationId).emit("new-message", populatedMessage);

    res.status(201).json({
      message: "Message sent successfully",
      newMessage: populatedMessage,
    });
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        message: "Invalid conversation ID",
      });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    const isParticipant = conversation.participants.some(
      (participantId) => participantId.toString() === req.user._id.toString(),
    );

    if (!isParticipant) {
      return res.status(403).json({
        message: "You are not authorized to update this conversation",
      });
    }

    await Message.updateMany(
      {
        conversationId,
        sender: { $ne: req.user._id },
        readBy: { $ne: req.user._id },
      },
      {
        $addToSet: { readBy: req.user._id },
      },
    );

    res.status(200).json({
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error("Error in markMessagesAsRead controller:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
