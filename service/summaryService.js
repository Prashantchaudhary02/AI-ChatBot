import Chat from "../model/chatSchema.js";
import Message from "../model/messageSchema.js";
import User from "../model/userSchema.js";
import { generateAIResponse } from "./geminiService.js";

const SUMMARY_CHUNK_SIZE = 20;

export const updateSummaryIfNeeded = async (chatId) => {
  const chat = await Chat.findById(chatId);

  if (!chat) return;

  const unsummarizedCount =
    chat.messageCount - chat.summarizedTillMessageNumber;

  if (unsummarizedCount < SUMMARY_CHUNK_SIZE) {
    return;
  }

  const messagesToSummarize = await Message.find({
    chatId: chat._id,
  })
    .sort({ createdAt: 1 })
    .skip(chat.summarizedTillMessageNumber)
    .limit(SUMMARY_CHUNK_SIZE);

  if (messagesToSummarize.length === 0) return;

  // 1. Move system prompt to systemInstruction string
  const systemInstruction = 
    "Summarize the conversation. Keep important context, user goals, decisions, and unresolved doubts. Do not add extra information.";

  // 2. Format contents payload for Gemini SDK
  const contents = [
    {
      role: "user",
      parts: [
        { text: `Previous summary: ${chat.summary || "No previous summary yet."}` }
      ],
    },
    ...messagesToSummarize.map((msg) => ({
      role: msg.role === "assistant" ? "model" : msg.role,
      parts: [{ text: msg.content }],
    })),
    {
      role: "user",
      parts: [{ text: "Summarize the above conversation." }],
    },
  ];

  // 3. Pass formatted Gemini payload
  const { aiReply, usage } = await generateAIResponse({
    model: chat.model,
    contents,
    systemInstruction,
  });

  chat.summary = aiReply;
  chat.summaryUpdatedAt = new Date();
  chat.summarizedTillMessageNumber += messagesToSummarize.length;

  chat.usage.promptTokens += usage.promptTokens;
  chat.usage.completionTokens += usage.completionTokens;
  chat.usage.totalTokens += usage.totalTokens;

  await chat.save();

  const user = await User.findById(chat.userId);

  if (user) {
    user.usage.tokenUsed += usage.totalTokens;
    user.usage.totalTokenUsed += usage.totalTokens;
    await user.save();
  }
};