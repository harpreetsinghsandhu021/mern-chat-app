import express from "express";

import { protect } from "../controllers/authController.js";
import {
  sendMessage,
  getMessages,
  uploadFiles,
  handleFiles,
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/", protect, uploadFiles, handleFiles, sendMessage);
router.get("/:conversation_id", protect, getMessages);

export default router;
