import mongoose from "mongoose";

const { Schema, model } = mongoose;

const chatSchema = new Schema({
  role: {
    type: String,
    enum: ["user", "assistant", "system", "summary"], // restrict values
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat", // refers to another Chat message
    default: null,
  },
}, { timestamps: true });

const Chat = model("Chat", chatSchema);

export default Chat;
