import gemini from "../Config/Gemini.js";

export const generateAIResponse = async ({ model, contents, systemInstruction }) => {
  try {
    // 1. Call Gemini API
    const response = await gemini.models.generateContent({
      model: model || "gemini-3.6-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    // 2. Extract text reply
    const aiReply = response.text;

    // 3. Extract usage metadata safely
    const usageMetadata = response.usageMetadata;

    const usage = {
      promptTokens: usageMetadata?.promptTokenCount || 0,
      completionTokens: usageMetadata?.candidatesTokenCount || 0,
      totalTokens: usageMetadata?.totalTokenCount || 0,
    };

    // 4. Return both aiReply and usage object
    return {
      aiReply,
      usage,
    };
  } catch (error) {
    console.error("Gemini API Error in geminiService:", error);
    throw error;
  }
};