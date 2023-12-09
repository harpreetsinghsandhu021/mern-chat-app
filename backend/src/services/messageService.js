import { catchAsync } from "../utils/catchAsync.js";
import Message from "../models/messageModel.js";
import AppError from "../utils/appError.js";
import Conversation from "../models/conversationModel.js";

export const createMessage = async (data) => {
  const newMessage = await Message.create(data);

  if (!newMessage) {
    throw new AppError("Oops... Something went wrong!.");
  }

  return newMessage;
};

export const populateMessage = async (id) => {
  const message = await Message.findById(id)
    .populate({
      path: "sender",
      select: "name photo",
      model: "User",
    })
    .populate({
      path: "conversation",
      select: "name isGroup users photo",
      model: "Conversation",
      populate: {
        path: "users",
        select: "name email photo",
        model: "User",
      },
    });
  if (!message) {
    throw new AppError("Oops... Something went wrong!.");
  }
  return message;
};

export const updateLatestMessage = async (conversationId, newMessage) => {
  const updatedConversationLatestMessage = await Conversation.findByIdAndUpdate(
    conversationId,
    {
      latestMessage: newMessage,
    }
  );

  if (!updatedConversationLatestMessage) {
    throw new AppError("Oops... Something went wrong!.");
  }
  return updatedConversationLatestMessage;
};
