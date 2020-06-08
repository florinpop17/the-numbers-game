const welcome = document.getElementById('welcome');
const chat = document.getElementById('chat');

const form = document.getElementById('form');
const name = document.getElementById('name');

const messagesEl = document.getElementById('messages');
const send = document.getElementById('send');
const text = document.getElementById('text');

let socket = undefined;

form.addEventListener('submit', (e) => {
	e.preventDefault();

	const nameValue = name.value;

	if (nameValue) {
		// we are connecting the socket
		socket = window.io();

		socket.emit('user_joined', nameValue);

		startGame();
	}
});

function startGame() {
	welcome.classList.add('hidden');
	chat.classList.remove('hidden');

	socket.on('messages', (messages) => {
		messagesEl.innerHTML = `
            ${messages
							.map(
								(message) =>
									`<p><strong>${message.user.name}:</strong> ${message.text}</p>`
							)
							.join('')}
        `;

		messagesEl.scrollTop = messagesEl.scrollHeight;
	});
}

send.addEventListener('submit', (e) => {
	e.preventDefault();

	const message = text.value;

	socket.emit('message', message);

	// empty input
	text.value = '';
});
