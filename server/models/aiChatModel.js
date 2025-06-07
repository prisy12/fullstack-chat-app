import mongoose from "mongoose";

const aiChatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // optional, if you have a User model
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

const AIChat = mongoose.model("AIChat", aiChatSchema);

export default AIChat;
