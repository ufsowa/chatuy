const socket = io({
    autoConnect: true  // false - do not open channel on init
  });    // default socets listen client server localhost:8000
// socket.open()        // open active channel
//socket.connect("http://example.com");
//socket.on('message', (event) => addMessage(event.author, event.content));
socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('addUser', ({name}) => {
    addSystemMessage(`${name} has joined the conversation!`);    
});
socket.on('removeUser', ({name}) => {
    addSystemMessage(`${name} has left the conversation... :(`);    
});

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
        socket.emit('login', { name: userName})
    }
}

const addSystemMessage = (content) => {
    const message = document.createElement('li');
    message.classList.add('message', 'message--received');
    message.innerHTML =
        `<h3 class="message__author">Chat Bot</h3>
        <div class="message__content message__system">${content}</div>`
    elements.messagesList.insertAdjacentElement('beforeend', message);
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
    const messageContent = elements.messageContentInput.value;
    if(!messageContent) {
        alert('Missing message');
    } else {
        elements.messageContentInput.value= '';
        addMessage(userName, messageContent);
        socket.emit('message', { author: userName, content: messageContent })

    }
    console.log('send msg')
};

elements.loginForm.addEventListener('submit', login);
elements.addMessageForm.addEventListener('submit', sendMessage);