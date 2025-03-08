const express = require("express");
const spellChecker = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

spellChecker.post("/", async (req, res) => {
  const { text } = req.body;
  
  try {
    // Initialize the Gemini 2.0 Flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Create the prompt for spell checking
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ 
            text: "Check and correct spelling errors in the following text. Only return the corrected text without any additional comments or context: " + text 
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
    
    res.json(correctedText);
  } catch (error) {
    console.error("Error checking spelling:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = spellChecker;