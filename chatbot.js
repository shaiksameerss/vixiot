/* ==========================================
   VIXIOT AI CHATBOT
========================================== */

const chatToggle = document.getElementById(
    "vixiot-chat-toggle"
);

const chatWindow = document.getElementById(
    "vixiot-chat-window"
);

const chatClose = document.getElementById(
    "vixiot-chat-close"
);

const chatInput = document.getElementById(
    "vixiot-chat-input"
);

const chatSend = document.getElementById(
    "vixiot-chat-send"
);

const chatMessages = document.getElementById(
    "vixiot-chat-messages"
);


// Replace this with your actual backend URL
const BACKEND_URL =
    "https://YOUR-RENDER-SERVICE.onrender.com/chat";


/* OPEN CHAT */

chatToggle.addEventListener("click", () => {

    chatWindow.style.display = "flex";

    chatInput.focus();

});


/* CLOSE CHAT */

chatClose.addEventListener("click", () => {

    chatWindow.style.display = "none";

});


/* SEND MESSAGE */

chatSend.addEventListener("click", sendMessage);


chatInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        sendMessage();

    }

});


/* DISPLAY MESSAGE */

function addMessage(text, type) {

    const message = document.createElement("div");

    message.className =
        type === "user"
        ? "vixiot-user-message"
        : "vixiot-bot-message";

    message.textContent = text;

    chatMessages.appendChild(message);

    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}


/* SEND TO BACKEND */

async function sendMessage() {

    const question = chatInput.value.trim();

    if (!question) return;

    if (question.length > 2000) {

        addMessage(
            "Please keep your question under 2,000 characters.",
            "bot"
        );

        return;

    }


    addMessage(question, "user");

    chatInput.value = "";

    chatSend.disabled = true;


    const loadingMessage =
        document.createElement("div");

    loadingMessage.className =
        "vixiot-bot-message";

    loadingMessage.textContent =
        "Thinking...";

    chatMessages.appendChild(loadingMessage);


    try {

        const response = await fetch(
            BACKEND_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: question
                })
            }
        );


        if (!response.ok) {

            throw new Error(
                "Backend request failed"
            );

        }


        const data = await response.json();


        loadingMessage.remove();

        addMessage(
            data.answer || "No answer received.",
            "bot"
        );


    } catch (error) {

        loadingMessage.remove();

        addMessage(
            "Sorry, our AI assistant is temporarily unavailable. Please try again later.",
            "bot"
        );

        console.error(error);


    } finally {

        chatSend.disabled = false;

        chatInput.focus();

    }

}
