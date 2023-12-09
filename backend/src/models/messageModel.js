import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
      trim: true,
    },
    conversation: {
      type: mongoose.Schema.ObjectId,
      ref: "Conversation",
    },
    status: {
      type: String,
      default: "sent",
      enum: ["sent", "seen"],
    },
    files: [],
  },
  { timestamps: true }
);

messageSchema.pre("create", function () {
  console.log(this);
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
