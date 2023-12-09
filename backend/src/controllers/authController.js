import User from "../models/userModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import validator from "validator";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import sharp from "sharp";

const multerStorage = multer.memoryStorage();

const multerfilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an Image!.Please upload an Image.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerfilter,
});

export const uploadSingle = upload.single("photo");

export const resizePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError("Please provide an Image!"));

  if (req.user) {
    req.file.fileName = `user-${req.user.id}-${Date.now()}.jpeg`;
  } else {
    req.file.fileName = `user-${req.body.name}-${Date.now()}.jpeg`;
  }

  await sharp(req.file.buffer)
    .toFormat("jpeg")
    .resize(500, 500)
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.fileName}`);
  next();
});

const signToken = (id, email) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = async (user, statusCode, req, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }
    req.user = payload;
    next();
  });
});

export const signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    photo: req.file.fileName,
  });

  createSendToken(newUser, 201, req, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("please provide email or password", 400));
  }

  if (!validator.isEmail(email)) {
    return next(new AppError("not an email. please provide a valid email."));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("no user found! please sign up instead", 400));
  }

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 400));
  }

  createSendToken(user, 200, req, res);
});
