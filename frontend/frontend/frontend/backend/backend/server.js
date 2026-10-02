const express = require("express");
const cors = require("cors");

const { searchAU } = require("./auSearch");
const { generateAnswer } = require("./aiEngine");
const { lookupStudent } = require("./studentLookup");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(
    express.json({
        limit: "1mb"
    })
);


// Home / Health check
app.get("/", (req, res) => {

    res.json({
        project: "AU Help AI",
        status: "online",
        message: "AU Help AI backend is running"
    });

});


// AI Question API
app.post("/api/ask", async (req, res) => {

    try {

        const question = String(
            req.body.question || ""
        ).trim();


        if (!question) {

            return res.status(400).json({
                success: false,
                answer: "Please ask a question about Annamalai University."
            });

        }


        const data = await searchAU(question);

        const answer = await generateAnswer(
            question,
            data
        );


        res.json({
            success: true,
            answer: answer,
            verified: data.verified
        });


    } catch (error) {

        console.error(
            "ASK ERROR:",
            error
        );


        res.status(500).json({
            success: false,
            answer: "AU Help AI could not process your question right now."
        });

    }

});


// Public student lookup API
app.get("/api/student", async (req, res) => {

    try {

        const registerNumber = String(
            req.query.register_number || ""
        ).trim();


        if (!registerNumber) {

            return res.status(400).json({
                success: false,
                message: "Register number is required."
            });

        }


        const result = await lookupStudent(
            registerNumber
        );


        res.json(result);


    } catch (error) {

        console.error(
            "STUDENT ERROR:",
            error
        );


        res.status(500).json({
            success: false,
            message: "Student lookup is currently unavailable."
        });

    }

});


app.listen(
    PORT,
    () => {
        console.log(
            `AU Help AI running on port ${PORT}`
        );
    }
);
