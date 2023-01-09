var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');

var server = express();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended:true}));
server.use(express.json());

server.use(express.static('client/dist'));
server.use(express.static('static/photos'));
server.use(express.static('static/custom'));

require('dotenv').config();
const PORT = process.env.PORT;
const qusr = process.env.SQL_USR;
const qdb = process.env.SQL_DB;
const qpw = process.env.SQL_PW;
const qhst = process.env.SQL_HST;
const qp = process.env.SQL_PORT;
const KEY = process.env.KEY;

var connection = mysql.createConnection({
  host     : qhst,
  user     : qusr,
  password : qpw,
  database : qdb,
  port     : qp
});

connection.connect(); 
global.db = connection;

let sql = "CREATE TABLE IF NOT EXISTS photos (name VARCHAR(25), tour VARCHAR(25), position VARCHAR(2), date DATE, x DECIMAL(3,1), y DECIMAL(3,1), z DECIMAL(3,1), n INT, UNIQUE (name));";
db.query(sql, (err, results) => {
    if(err){console.log(err)};
    //console.log(results);
})

server.get("/", (req, res) => {
	res.sendFile('index.html');
});

server.post("/api/tours", (req, res) => {
	//const items = [{ name: "Test", img: "pdemo2.jpg" }, { name: "Test", img: "pdemo.jpg" }, { name: "Test", img: "pdemo2.jpg" }, { name: "Test", img: "pdemo2.jpg" }];
    //let sql = "SELECT DISTINCT on tour * FROM photos;";
	let sql = "SELECT * FROM photos;";
    db.query(sql, (err, results) => {
        if(err){
			console.log(err);
			res.send({error: true, message: 'SQL Error', data: results});
		}else{
			//probably could do this with SQL - need to solve for that
			let tours = [...new Map(results.map(item => [item['tour'], item])).values()];
			res.send({error: false, message: 'Success', data: tours});
		}	
    });
}); //res.send(items);

server.post("/api/tour", (req, res) => {
	let sql = "SELECT * FROM photos WHERE tour = '"+req.body.tour+"';";
    db.query(sql, (err, results) => {
        if(err){
			console.log(err);
			res.send({error: true, message: 'SQL Error', data: results});
		}else{
			res.send({error: false, message: 'Success', data: results});
		}	
    }); 
});

server.post("/api/update", (req, res) => {
	let d = req.body;
	if(d.key === KEY){
		let sql = "REPLACE INTO photos (name, tour, date, position, x, y, z, n) VALUES('"+d.name+"','"+d.tour+"','"+d.date+"','"+d.position+"','"+d.x+"','"+d.y+"','"+d.z+"','"+d.n+"');";
    	db.query(sql, (err, results) => {
        	if(err){
				console.log(err);
				res.send({error: true, message: 'SQL Error', data: results});
			}else{
				res.send({error: false, message: 'Success', data: results});
			}			
    	}); 
	}else{
		res.send({error: true, message:'Incorrect API Key'});
	}
});

server.post("/api/get", (req, res) => {
	let d = req.body;
	let sql = "SELECT * FROM photos WHERE name = '"+d.name+"';";
    db.query(sql, (err, results) => {
        if(err){
			console.log(err);
			res.send({error: true, message: 'SQL Error', data: results});
		}else{
			res.send({error: false, message: 'Success', data: results});
		}			
    }); 
});

server.listen(PORT, () => {
	console.log('Server Running on '+PORT);
});

/*


function getTours(){
     
}

function getTour(){
    
}

function getPhoto(){
    
}
*/