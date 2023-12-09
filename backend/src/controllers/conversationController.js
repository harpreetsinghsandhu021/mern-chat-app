import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import {
  checkConversationExists,
  createConversation,
  populateConversation,
  getUserConversations,
} from "../services/conversationService.js";

export const conversationController = catchAsync(async (req, res, next) => {
  const senderId = req.user.id;
  const { recieverId } = req.body;

  //   check if reciver id exists

  if (!recieverId) {
    return next(new AppError("No reciever found!.Please try again.", 403));
  }

  const existedConversation = await checkConversationExists(
    senderId,
    recieverId
  );

  if (!existedConversation) {
    const reciever = await User.findById(recieverId);

    let conversationData = {
      name: reciever.name,
      photo: reciever.photo,
      isGroup: false,
      users: [senderId, recieverId],
    };

    const newConversation = await createConversation(conversationData);

    const populatedConversation = await populateConversation(
      newConversation._id,
      "users status",
      "-password"
    );

    res.status(201).json(populatedConversation);
  } else {
    res.status(200).json(existedConversation);
  }
});

export const getConversations = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const conversations = await getUserConversations(userId);

  res.status(200).json(conversations);
});
