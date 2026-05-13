const express = require("express");
const axios = require("axios");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("."));

const API_KEY = process.env.GEMINI_API_KEY;

app.post("/ask", async (req, res) => {

    const userMessage = req.body.message;

    try {

        const response = await axios.post(

            `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`,

            {
                contents: [
                    {
                        parts: [
                            {
                                text: userMessage
                            }
                        ]
                    }
                ]
            }

        );

        const answer =
            response.data.candidates[0]
            .content.parts[0].text;

        res.send(answer);

    } catch (error) {

        console.log(
            JSON.stringify(
                error.response?.data,
                null,
                2
            )
        );

        res.status(500).send(
            "Error talking to Gemini"
        );
    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        "AI API running on port " + PORT
    );

});
