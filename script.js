const API_URL = 'https://anssi-openai-gateway.azurewebsites.net/api/http_trigger';
const API_KEY = 'qQGNldzEhrEKBq8v4HRBRs2eKRgVu27h';

const chatContainer = document.getElementById('chat-container');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const messageTemplate = document.getElementById('message-template');

function addMessage(text, role, isLoading = false) {
    const clone = messageTemplate.content.cloneNode(true);
    const messageEl = clone.querySelector('.message');
    const textEl = clone.querySelector('.text');

    messageEl.classList.add(role);
    if (isLoading) {
        textEl.classList.add('loading');
    }

    textEl.textContent = text;
    chatContainer.appendChild(clone);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    return textEl;
}

async function sendMessage(message) {
    const loadingEl = addMessage('Thinking...', 'assistant', true);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({
                system_prompt: 'You are a helpful assistant.',
                user_input: message
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        loadingEl.classList.remove('loading');
        loadingEl.textContent = data.openai_response;
    } catch (err) {
        loadingEl.classList.remove('loading');
        loadingEl.textContent = 'Error: ' + err.message;
    }
}

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (message === '') return;

    addMessage(message, 'user');
    userInput.value = '';
    sendMessage(message);
});
