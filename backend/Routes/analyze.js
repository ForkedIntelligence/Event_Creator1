const express = require("express");
const analyzeRouter = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

analyzeRouter.post("/", async (req, res) => {
  const { sentence } = req.body;

  try {
    // Initialize the Gemini 2.0 Flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Generate multiple responses in a single request
    const prompt = `Rephrase the following sentence in three different ways. Return only the rephrased sentences, separated by newlines with no additional comments or context: ${sentence}`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 150,
      },
    });

    // Extract the text response
    const responseText = result.response.text();
    
    // Split the response into individual sentences
    const rephrasedSentences = responseText
      .split("\n")
      .filter(sentence => sentence.trim().length > 0)
      .slice(0, 3); // Ensure we only get 3 responses
    
    res.json({ rephrasedSentences });
  } catch (error) {
    console.error("Error processing sentence:", error);
    res.status(500).json({ error: "Error processing sentence" });
  }
});

module.exports = analyzeRouter;