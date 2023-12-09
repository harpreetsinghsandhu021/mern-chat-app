import Conversation from "../models/conversationModel.js";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const checkConversationExists = async (senderId, recieverId) => {
  let conversations = await Conversation.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: senderId } } },
      { users: { $elemMatch: { $eq: recieverId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  if (!conversations) {
    throw new AppError("Oops... Something went wrong!.");
  }

  conversations = await User.populate(conversations, {
    path: "latestMessage.sender",
    select: "name email photo status",
  });

  return conversations[0];
};

export const createConversation = async (data) => {
  const newConversation = await Conversation.create(data);

  if (!newConversation) {
    throw new AppError("Oops... Something went wrong!.");
  }

  return newConversation;
};

export const populateConversation = async (
  id,
  fieldsToPopulate,
  fieldsToRemove
) => {
  const populatedConversation = await Conversation.findOne({
    _id: id,
  }).populate(fieldsToPopulate, fieldsToRemove);

  if (!populatedConversation) {
    throw new AppError("Oops... Something went wrong!.");
  }

  return populatedConversation;
};

export const getUserConversations = async (userId) => {
  let conversations;

  await Conversation.find({
    users: { $elemMatch: { $eq: userId } },
  })
    .populate("users", "-password")
    .populate("admin")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (results) => {
      results = await User.populate(results, {
        path: "latestMessage.sender",
        select: "name email photo status",
      });
      conversations = results;
    });

  return conversations;
};
