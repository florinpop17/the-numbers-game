const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let currentNumber = 1;
const messages = [
	{
		user: {
			name: 'Admin',
		},
		text: 1,
	},
];
const players = [];

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
	socket.emit('messages', messages);

	socket.on('user_joined', (name) => {
		const player = {
			id: socket.id,
			name,
		};

		console.log(player, 'joined');

		players.push(player);
	});

	socket.on('message', (message) => {
		const number = +message;

		messages.push({
			user: players.find((player) => socket.id === player.id),
			text: number,
		});

		if (number === currentNumber + 1) {
			currentNumber++;
		} else {
			messages.push({
				user: {
					name: 'Admin',
				},
				text: 'You failed. Game Restarted!',
			});
			messages.push({
				user: {
					name: 'Admin',
				},
				text: '1',
			});

			currentNumber = 1;
		}

		io.emit('messages', messages);
	});
});

http.listen(3000, () => {
	console.log('listening on *:3000');
});
