const API_URL = "https://au-feat.onrender.com";

const form = document.getElementById("aiSearchForm");
const input = document.getElementById("aiInput");
const output = document.getElementById("responseText");
const status = document.getElementById("responseStatus");

function showResponse(text, state = "Ready") {
    output.textContent = text;
    status.textContent = state;
}

async function askAI(question) {

    question = question.trim();

    if (!question) {
        showResponse(
            "Please ask something about Annamalai University.",
            "Waiting"
        );
        return;
    }

    showResponse(
        "Checking AU information...",
        "Searching"
    );

    try {

        const response = await fetch(
            `${API_URL}/api/ask`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    question: question
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Request failed"
            );
        }

        showResponse(
            data.answer || "No verified answer was found.",
            "AU Help AI"
        );

    } catch (error) {

        console.error("AU Help AI Error:", error);

        showResponse(
            "AU Help AI backend is temporarily unavailable. Please try again.",
            "Connection issue"
        );
    }
}


form.addEventListener("submit", function (event) {

    event.preventDefault();

    askAI(input.value);

});


document
    .querySelectorAll("[data-query]")
    .forEach(function (button) {

        button.addEventListener("click", function () {

            const question = button.dataset.query;

            input.value = question;

            askAI(question);

        });

    });
