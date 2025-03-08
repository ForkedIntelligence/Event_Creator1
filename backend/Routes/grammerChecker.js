const express = require("express");
const grammarCheck = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

grammarCheck.post("/", async (req, res) => {
  const { text } = req.body;
  
  try {
    // Initialize the Gemini 2.0 Flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Create the prompt for grammar checking
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ 
            text: "Check and correct grammar errors in the following text. Only return the corrected text without any additional comments or context: " + text 
          }],
        },
      ],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 150,
      },
    });

    // Extract the corrected text
    const correctedText = result.response.text().trim();
    
    res.json({ correctedText });
  } catch (error) {
    console.error("Error checking grammar:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = grammarCheck;