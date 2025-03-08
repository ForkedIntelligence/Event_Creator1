const express = require("express");
const cors = require("cors");
require("dotenv").config();
const analyzeRouter = require("./Routes/analyze");
const grammarCheck = require("./Routes/grammerChecker"); // Note: typo in filename
const spellChecker = require("./Routes/spellChecker");
const eventDescriptionRouter = require("./Routes/eventDescriptionRouter.js");

const app = express();
const port = 5000;

// Check for required API keys
if (!process.env.GEMINI_API_KEY) {
  console.warn("WARNING: GEMINI_API_KEY is not set in the .env file. API calls will fail.");
}

// config cors
app.use(cors());
app.use(express.json()); // for parsing application/json

// routes
app.use("/api/analyze", analyzeRouter);
app.use("/api/grammarcheck", grammarCheck);
app.use("/api/spellcheck", spellChecker);
app.use("/api/event-description", eventDescriptionRouter);

// Simple health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// start server
app.listen(port, () => {
  console.log(`AI Writing app listening at http://localhost:${port}`);
});