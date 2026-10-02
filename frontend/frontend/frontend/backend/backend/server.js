const express = require("express");
const cors = require("cors");

const { answerQuestion } = require("./aiEngine");

const app = express();

const PORT = process.env.PORT || 10000;


/* -----------------------------
   MIDDLEWARE
----------------------------- */

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  })
);

app.use(express.json());


/* -----------------------------
   HEALTH CHECK
----------------------------- */

app.get("/", (req, res) => {

  res.json({
    project: "AU Help AI",
    status: "online",
    message: "AU Help AI backend is running"
  });

});


app.get("/api/health", (req, res) => {

  res.json({
    success: true,
    status: "online",
    service: "AU Help AI"
  });

});


/* -----------------------------
   MAIN AI ENDPOINT
----------------------------- */

app.post("/api/ask", async (req, res) => {

  try {

    const query =
      typeof req.body?.query === "string"
        ? req.body.query.trim()
        : "";


    if (!query) {

      return res.status(400).json({
        success: false,
        message: "Please enter a question."
      });

    }


    if (query.length > 1000) {

      return res.status(400).json({
        success: false,
        message: "Question is too long."
      });

    }


    const result =
      await answerQuestion(query);


    return res.json({
      success: true,
      answer:
        result.answer ||
        "I could not find an answer.",
      category:
        result.category ||
        "AU Information"
    });


  } catch (error) {

    console.error(
      "API /api/ask error:",
      error.message
    );


    return res.status(500).json({
      success: false,
      message:
        "AU Help AI could not process the question right now."
    });

  }

});


/* -----------------------------
   404
----------------------------- */

app.use((req, res) => {

  res.status(404).json({
    success: false,
    message: "Endpoint not found."
  });

});


/* -----------------------------
   START SERVER
----------------------------- */

app.listen(PORT, () => {

  console.log(
    `AU Help AI backend running on port ${PORT}`
  );

});
