import Chat from "../models/chat.models.js";
import { GoogleGenAI } from "@google/genai";
import Summary from "../models/summary.models.js";
// Create a new chat message

export const createChat = async (req, res) => {
  try {
    const { role, message, replyTo } = req.body;

    // Save user chat
    const newUserChat = await Chat.create({
      role: "user",
      message,
      replyTo,
    });

    // Get last summary
    const lastSummaryChat = await Summary.findOne().sort({ createdAt: -1 });
    const summaryText = lastSummaryChat ? lastSummaryChat.message : "";

    // Last 3 messages
    const lastFewChats = ( await Chat.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .lean()
    ).reverse();  // now it's oldest → newest

    const chatHistory = [
    {
        role: "user",
        parts: [{ text: `Conversation summary so far: ${summaryText}` }],
    },
    ...(lastFewChats.length > 0
        ? lastFewChats.map((chat) => ({
            role: chat.role === "assistant" ? "model" : "user",
            parts: [{ text: chat.message }],
        }))
        : []),
    ];


    const ai = new GoogleGenAI(process.env.GOOGLE_API_KEY);

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: chatHistory,
    });

    const reply = result.text;

    // Save AI reply
    const newAiChat = await Chat.create({
      role: "assistant",
      message: reply,
      replyTo: newUserChat._id,
    });

    // Update summary with old summary + new messages
    const updatedSummary = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: "Update the running conversation summary concisely." }] },
        { role: "user", parts: [{ text: `Previous summary: ${summaryText}` }] },
        ...[newUserChat, newAiChat].map((chat) => ({
          role: chat.role === "assistant" ? "model" : "user",
          parts: [{ text: chat.message }],
        })),
      ],
    });

    const updatedSummaryText = updatedSummary.text;

    await Summary.findOneAndUpdate(
        {},
        { message: updatedSummaryText },
        { upsert: true, new: true }
    );


    res.status(201).json({ success: true, data: [newUserChat, newAiChat] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get all chat messages
export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find() // populate reply message
    res.status(200).json({ success: true, data: chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};