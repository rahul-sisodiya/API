const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/*
    MongoDB Atlas Connection
*/
mongoose.connect(process.env.MONGO_URI)

.then(() => {

    console.log(
        "MongoDB Atlas Connected"
    );

})

.catch((err) => {

    console.log(
        "MongoDB Error:",
        err
    );

});

/*
    Schema
*/
const historySchema =
new mongoose.Schema({

    question: {
        type: String,
        required: true,
        unique: true
    },

    answer: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

/*
    Model
*/
const History =
mongoose.model(
    "History",
    historySchema
);

const API_KEY =
process.env.GEMINI_API_KEY;

/*
    Main Route
*/
app.post("/ask", async (req, res) => {

    try {

        let userMessage =
            req.body.message;

        /*
            Clean Input
        */
        userMessage =
            userMessage
            .trim()
            .toLowerCase();

        /*
            Return History
        */
        if (userMessage === "history") {

            const allHistory =
                await History.find()
                .sort({
                    createdAt: -1
                });

            return res.json(
                allHistory
            );
        }

        /*
            Search Existing Question
        */
        const existingQuestion =
            await History.findOne({

                question: userMessage

            });

        /*
            Return Saved Answer
        */
        if (existingQuestion) {

            return res.send(
                existingQuestion.answer
            );
        }

        /*
            Call Gemini API
        */
        const response =
            await axios.post(

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
            response.data
            .candidates[0]
            .content.parts[0]
            .text;

        /*
            Save To MongoDB
        */
        await History.create({

            question: userMessage,

            answer: answer

        });

        /*
            Send Answer
        */
        res.send(answer);

    } catch (error) {

        console.log(
            JSON.stringify(
                error.response?.data || error,
                null,
                2
            )
        );

        res.status(500).send(
            "Error talking to Gemini"
        );

    }

});

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});
