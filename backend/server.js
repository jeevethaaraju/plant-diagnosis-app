// server.js
import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import multer from "multer";
import FormData from "form-data";
import path from "path";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Example route for plant diagnosis
app.get("/getDiagnosis", async (req, res) => {
  const keyword = req.query.keyword || "plant";

  try {
    // Call OpenAI API to get diagnosis
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a plant doctor." },
          { role: "user", content: `Diagnose the plant problem for: ${keyword} and suggest solutions.` }
        ],
        max_tokens: 300
      })
    });

    const data = await response.json();
    const diagnosis = data.choices?.[0]?.message?.content || "No diagnosis found.";
    res.json({ diagnosis });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get diagnosis." });
  }
});

// Serve static files if needed
app.use("/static", express.static(path.join(path.resolve(), "static")));

// ================================
// ⚡ Render PORT Setup
// ================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Plant Diagnosis Backend running on port ${PORT}`);
});
