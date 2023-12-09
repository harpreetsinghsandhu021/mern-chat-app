import User from "../models/userModel.js";
import { getOne, getAll, updateOne, deleteOne } from "./handlerFactory.js";

export const getUser = getOne(User);
export const getAllUsers = getAll(User);

// Do NOT update passwords with this!
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
