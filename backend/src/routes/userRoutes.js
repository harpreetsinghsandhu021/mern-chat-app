import express from "express";
import { getAllUsers, getUser } from "../controllers/userController.js";
import {
  signUp,
  login,
  uploadSingle,
  resizePhoto,
} from "../controllers/authController.js";

const router = express.Router();

router.route("/").get(getAllUsers);

router.route("/:id").get(getUser);

router.post("/signup", uploadSingle, resizePhoto, signUp);
router.post("/login", login);

export default router;
