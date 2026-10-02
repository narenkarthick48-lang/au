const API_URL =
  window.AU_API_URL ||
  "https://au-feat.onrender.com";

const form =
  document.getElementById("aiSearchForm");

const input =
  document.getElementById("aiInput");

const responseText =
  document.getElementById("responseText");

const responseStatus =
  document.getElementById("responseStatus");

const responseActions =
  document.getElementById("responseActions");

const quickButtons =
  document.querySelectorAll(
    "[data-query]"
  );


function setLoading() {

  responseStatus.textContent =
    "Searching AU public information...";

  responseText.innerHTML = `
    <div class="ai-loading">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;

  responseActions.innerHTML = "";
}


function setError(message) {

  responseStatus.textContent =
    "Unable to answer";

  responseText.textContent =
    message;

  responseActions.innerHTML = "";
}


function displayAnswer(data) {

  responseStatus.textContent =
    data.category
      ? `Answered · ${data.category}`
      : "Answer ready";

  let answer =
    data.answer ||
    data.message ||
    "No answer was returned.";

  /*
    Backend text மட்டும் UI-க்கு காட்டப்படும்.
    Source URL / AU website link இங்கே காட்டப்படாது.
  */

  responseText.textContent =
    answer;

  responseActions.innerHTML = "";
}


async function askAI(query) {

  const cleanQuery =
    String(query || "").trim();

  if (!cleanQuery) {
    return;
  }

  setLoading();

  try {

    const response =
      await fetch(
        `${API_URL}/api/ask`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            query: cleanQuery
          })
        }
      );


    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }


    if (!response.ok) {

      throw new Error(
        data?.message ||
        "Backend request failed."
      );

    }


    if (!data) {

      throw new Error(
        "Invalid response from AU Help AI backend."
      );

    }


    displayAnswer(data);


  } catch (error) {

    console.error(
      "AU Help AI error:",
      error
    );


    setError(
      "AU Help AI backend-ஐ தற்போது அணுக முடியவில்லை. சிறிது நேரம் கழித்து மீண்டும் முயற்சி செய்யுங்கள்."
    );

  }
}


form.addEventListener(
  "submit",
  function (event) {

    event.preventDefault();

    const query =
      input.value.trim();

    if (!query) {
      input.focus();
      return;
    }

    askAI(query);

  }
);


quickButtons.forEach(
  button => {

    button.addEventListener(
      "click",
      function () {

        const query =
          this.dataset.query;

        if (!query) {
          return;
        }

        input.value = query;

        askAI(query);

      }
    );

  }
);


input.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      form.requestSubmit();

    }

  }
);
