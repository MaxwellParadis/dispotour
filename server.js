var express = require('express');
var bodyParser = require('body-parser');

var server = express();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended:true}));
server.use(express.json());

server.use(express.static('disposition/public'));
server.use(express.static('static/photos'));
server.use(express.static('static/custom'));

require('dotenv').config();
const PORT = process.env.PORT;

server.get("/", (req, res) => {
	res.sendFile('index.html');
});

server.listen(PORT, () => {
	console.log('Server Running on '+PORT);
});