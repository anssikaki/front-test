const API_URL = 'https://anssi-openai-gateway.azurewebsites.net/api/http_trigger';
const API_KEY = 'qQGNldzEhrEKBq8v4HRBRs2eKRgVu27h';

const chatContainer = document.getElementById('chat-container');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const personaSwitcher = document.getElementById('persona-switcher');
const examples = document.querySelectorAll('#example-prompts .example');
const messageTemplate = document.getElementById('message-template');

const personaPrompts = {
    expert: 'You are an expert assistant.',
    coach: 'You are a supportive coach guiding the user.',
    analyst: 'You analyze data and provide detailed insights.',
    crazy: 'You are a crazy person and respond unpredictably.'
};

let currentPersona = personaPrompts.expert;

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

function typeText(element, text, i = 0) {
    if (i < text.length) {
        element.textContent += text.charAt(i);
        setTimeout(() => typeText(element, text, i + 1), 20);
    }
}

async function sendMessage(message) {
    const loadingEl = addMessage('Thinking', 'assistant', true);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({
                system_prompt: currentPersona,
                user_input: message
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        loadingEl.classList.remove('loading');
        loadingEl.textContent = '';
        typeText(loadingEl, data.openai_response);
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

personaSwitcher.addEventListener('change', () => {
    const value = personaSwitcher.value;
    currentPersona = personaPrompts[value] || personaPrompts.expert;
});

examples.forEach(el => {
    el.addEventListener('click', () => {
        userInput.value = el.textContent;
        chatForm.dispatchEvent(new Event('submit'));
    });
});
