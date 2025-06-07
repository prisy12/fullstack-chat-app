import express from "express";
import axios from "axios";
// import { axiosInstance } from "../lib/axios.js";
import dotenv from "dotenv";
import AIChat from "../models/aiChatModel.js"; // Your mongoose model

dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { userId, prompt } = req.body;

  if (!userId || !prompt) {
    return res.status(400).json({ error: "userId and prompt are required" });
  }

  try {
    // Call Cohere or your AI API with prompt
    const response = await axios.post(
      "https://api.cohere.ai/v1/generate",
      {
        model: "command",
        prompt: prompt,
        max_tokens: 100,
        temperature: 0.9,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiReply = response.data.generations[0].text.trim();

    // Save user message to DB
    const userMsgDoc = await AIChat.create({
      userId,
      role: "user",
      text: prompt,
    });

    // Save AI assistant message to DB
    const aiMsgDoc = await AIChat.create({
      userId,
      role: "assistant",
      text: aiReply,
    });

    res.status(200).json({
      userMessageId: userMsgDoc._id,
      aiMessageId: aiMsgDoc._id,
      reply: aiReply,
    });
  } catch (error) {
    console.error("AI API or DB Error:", error?.response?.data || error.message);
    res.status(500).json({ error: "AI API call failed or DB error" });
  }
});

// DELETE route (for deleting user messages)
router.delete("/:messageId", async (req, res) => {
  const { messageId } = req.params;

  try {
    await AIChat.findByIdAndDelete(messageId);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to delete message:", error.message);
    res.status(500).json({ error: "Failed to delete message" });
  }
});

export default router;
