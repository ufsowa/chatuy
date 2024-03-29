const elements = {
    loginForm: document.querySelector('#welcome-form'),
    messageSection: document.querySelector('#messages-section'),
    messagesList: document.querySelector('#messages-list'),
    addMessageForm: document.querySelector('#add-messages-form'),
    userNameInput: document.querySelector('#username'),
    messageContentInput: document.querySelector('#message-content'),
};

let userName = '';


const login = (e) => {
    e.preventDefault();
    const user = elements.userNameInput.value;
    if(!user) {
        alert('Missing user');
    } else {
        userName = user;
        elements.userNameInput.value= '';
        elements.loginForm.classList.remove('show');
        elements.messageSection.classList.add('show');
    }
}

const addMessage = (author, content) => {
    const message = document.createElement('li');
    message.classList.add('message', 'message--received');
    author === userName && message.classList.add('message--self');
    message.innerHTML =
        `<h3 class="message__author">${author === userName ? 'You' : author}</h3>
        <div class="message__content">${content}</div>`
    elements.messagesList.insertAdjacentElement('beforeend', message);
}

const sendMessage = (e) => {
    e.preventDefault();
    const msg = elements.messageContentInput.value;
    if(!msg) {
        alert('Missing message');
    } else {
        elements.messageContentInput.value= '';
        addMessage(userName, msg);
    }
    console.log('send msg')
};

elements.loginForm.addEventListener('submit', login);
elements.addMessageForm.addEventListener('submit', sendMessage);