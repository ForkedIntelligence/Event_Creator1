// Routes/eventDescription.js
const express = require("express");
const eventDescriptionRouter = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Single description endpoint
eventDescriptionRouter.post("/", async (req, res) => {
  const { eventInfo, existingDescription } = req.body;
  
  try {
    // Initialize the Gemini 2.0 Flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    let prompt = "";
    
    if (existingDescription && existingDescription.trim().length > 0) {
      prompt = `
        I have an event with the following details:
        ${JSON.stringify(eventInfo, null, 2)}
        
        I've started writing a description for this event:
        "${existingDescription}"
        
        Please enhance and complete this description, making it engaging and informative. Only return the final description without any additional comments or context.
      `;
    } else {
      prompt = `
        Generate an engaging and informative description for an event with the following details:
        ${JSON.stringify(eventInfo, null, 2)}
        
        The description should highlight key information, be appealing to potential attendees, and have a professional tone. Only return the description without any additional comments or context.
      `;
    }
    
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    const generatedDescription = result.response.text().trim();
    
    res.json({ description: generatedDescription });
  } catch (error) {
    console.error("Error generating event description:", error);
    res.status(500).json({ error: error.message });
  }
});

// Multiple descriptions endpoint
eventDescriptionRouter.post("/multiple", async (req, res) => {
  const { eventInfo, existingDescription } = req.body;
  
  try {
    // Initialize the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    let prompt = "";
    
    if (existingDescription && existingDescription.trim().length > 0) {
      prompt = `
        I have an event with the following details:
        ${JSON.stringify(eventInfo, null, 2)}
        
        I've started writing a description for this event:
        "${existingDescription}"
        
        Please generate 3 different, complete descriptions for this event.
        Each description should have a unique style and approach, while still being professional and engaging.
        Make sure each description is complete and self-contained.
        Format your response as 3 separate paragraphs with a blank line between each description.
        Do not number the descriptions or add any headings.
        Only include the descriptions without any additional text.
      `;
    } else {
      prompt = `
        Generate 3 different descriptions for an event with the following details:
        ${JSON.stringify(eventInfo, null, 2)}
        
        Each description should have a unique style and approach, while still being professional and engaging.
        Make sure each description is complete and self-contained.
        Format your response as 3 separate paragraphs with a blank line between each description.
        Do not number the descriptions or add any headings.
        Only include the descriptions without any additional text.
      `;
    }
    
    console.log("Sending prompt to Gemini:", prompt);
    
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 1500,
      },
    });

    const fullResponse = result.response.text().trim();
    console.log("Received response from Gemini:", fullResponse);
    
    // Split by double newlines to separate the descriptions
    const descriptions = fullResponse.split(/\n\s*\n/).filter(desc => desc.trim().length > 0);
    console.log("Parsed descriptions:", descriptions);
    
    // Ensure we have descriptions even if parsing fails
    const finalDescriptions = descriptions && Array.isArray(descriptions) && descriptions.length > 0 
      ? descriptions.slice(0, 3) 
      : ["Description option 1", "Description option 2", "Description option 3"];
    
    // If we somehow got fewer than 3, add placeholders
    while (finalDescriptions.length < 3) {
      finalDescriptions.push("Description option " + (finalDescriptions.length + 1));
    }
    
    console.log("Sending final descriptions to client:", finalDescriptions);
    res.json({ descriptions: finalDescriptions });
  } catch (error) {
    console.error("Error generating multiple descriptions:", error);
    res.status(500).json({ 
      error: error.message,
      descriptions: ["Error generating description 1", "Error generating description 2", "Error generating description 3"]
    });
  }
});

module.exports = eventDescriptionRouter;