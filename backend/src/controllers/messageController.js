import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import {
  createMessage,
  populateMessage,
  updateLatestMessage,
} from "../services/messageService.js";
import Message from "../models/messageModel.js";
import multer from "multer";
import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import mime from "mime";
import APIFeatures from "../utils/apiFeatures.js";

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image") ||
    file.mimetype.startsWith("video") ||
    file.mimetype.startsWith("application") ||
    file.mimetype.startsWith("text")
  ) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Not an Image,Video,or document!.Please upload an Image or Video.",
        400
      ),
      false
    );
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadFiles = upload.fields([
  { name: "images" },
  { name: "videos" },
  { name: "documents" },
]);

export const handleFiles = catchAsync(async (req, res, next) => {
  if (Object.keys(req.files).length === 0) return next();

  if (!req.files) return next();

  req.body.files = [];
  if (req.files.images) {
    await Promise.all(
      req.files.images.map(async (file, i) => {
        const fileName = `user-${req.user.id}-images-message-${
          file.originalname
        }-${Date.now()}.jpeg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`public/img/files/${fileName}`);

        req.body.files.push(fileName);
      })
    );
  } else if (req.files.videos) {
    req.files.videos.map((video, i) => {
      const tempFilePath = "public/img/temp_video.mp4";
      fs.writeFileSync(tempFilePath, video.buffer);

      const fileName = `user-${req.user.id}-videos-message-${Date.now()}.mp4`;

      ffmpeg(tempFilePath)
        .toFormat("mp4")
        .on("end", () => {
          console.log("Conversion finished");

          fs.unlinkSync(tempFilePath);
        })
        .on("error", (err) => {
          console.error("Error:", err);

          if (tempFilePath) {
            fs.unlinkSync(tempFilePath);
          }
        })
        .save(`public/img/files/${fileName}`);

      req.body.files.push(fileName);
    });
  } else {
    req.files.documents.map((file) => {
      const tempFilePath = `public/img/files/${file.originalname}`;

      try {
        let fileSize;

        if (file.size < 1024 * 1024) {
          fileSize = (file.size / 1024).toFixed(2) + " KB";
        } else {
          fileSize = (file.size / (1024 * 1024)).toFixed(2) + " MB";
        }

        const type = mime.getExtension(file.mimetype);

        fs.appendFile(tempFilePath, file.buffer, () => {});
        req.body.files.push({
          file: file.originalname,
          size: fileSize,
          type: type.toUpperCase(),
        });
      } catch (err) {
        console.log(err);
      }
    });
  }
  next();
});

export const sendMessage = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const { message, conversationId, files } = req.body;

  if (!conversationId) {
    throw next(new AppError("either no conversation ID is provided.", 400));
  }

  const messageData = {
    sender: userId,
    message,
    conversation: conversationId,
    files: files || [],
  };

  let newMessage = await createMessage(messageData);

  const populatedMessage = await populateMessage(newMessage._id);
  await updateLatestMessage(conversationId, newMessage);

  res.status(201).json(populatedMessage);
});
export const getMessages = catchAsync(async (req, res, next) => {
  const conversationId = req.params.conversation_id;

  if (!conversationId) {
    return next(new AppError("no converation Id found."));
  }

  const messages = new APIFeatures(
    Message.find({
      conversation: conversationId,
    }).populate("sender", "name photo status"),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // const doc = await features.query.explain();
  const doc = await messages.query;
  if (!messages) {
    return next(new AppError("something went wrong"));
  }

  res.status(200).json(doc);
});
