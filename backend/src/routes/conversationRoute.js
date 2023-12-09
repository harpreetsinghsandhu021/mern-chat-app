import express from "express";
import { protect } from "../controllers/authController.js";
import {
  conversationController,
  getConversations,
} from "../controllers/conversationController.js";

const router = express.Router();

router
  .route("/")
  .post(protect, conversationController)
  .get(protect, getConversations);

export default router;
