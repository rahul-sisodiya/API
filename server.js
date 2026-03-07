const express = require("express");
const axios = require("axios");
require("dotenv").config();
const app = express();
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

app.post("/ask", async (req, res) => {

    const userMessage = req.body.message;

    try {

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
            {
                contents: [
                    {
                        parts: [{ text: userMessage }]
                    }
                ]
            }
        );

        const answer =
            response.data.candidates[0].content.parts[0].text;

        res.send(answer);

    } catch (error) {

        res.send("Error talking to Gemini");

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("AI API running");
});