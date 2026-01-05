import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import FormData from "form-data";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const upload = multer();

app.use(express.static("../frontend")); // serve frontend files

// Upload leaf photo and analyze
app.post("/diagnose", upload.single("leaf"), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).send("No file uploaded");

        // Prepare API call to AI (replace with real AI endpoint)
        const form = new FormData();
        form.append("file", file.buffer, { filename: file.originalname });

        // Example: AI vision API (replace with actual endpoint)
        const response = await fetch("https://api.openai.com/v1/images/analyze", {
            method: "POST",
            headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
            body: form,
        });

        const data = await response.json();

        // Mock response for testing
        // const data = { diagnosis: { name: "Powdery Mildew", advice: "Spray fungicide and avoid overwatering" } };

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error analyzing image");
    }
});

app.listen(3000, () => console.log("Backend running on http://localhost:3000"));
