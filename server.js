var express = require('express');
//var bodyParser = require('body-parser');
var mysql = require('mysql2');

var server = express();
//server.use(bodyParser.json());
//server.use(bodyParser.urlencoded({extended:true}));
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

let isql = "CREATE TABLE IF NOT EXISTS images (name VARCHAR(25), tour VARCHAR(25), iposition VARCHAR(2), date DATE, nx TINYINT, ny TINYINT, UNIQUE (name));";
db.query(isql, (err, results) => {
    if(err){console.log(err)};
    //console.log(results);
})

let lsql = "CREATE TABLE IF NOT EXISTS links (id INT AUTO_INCREMENT, tour VARCHAR(25), enable BOOL, iposition VARCHAR(2), lposition VARCHAR(2), x TINYINT, y TINYINT,  z TINYINT, PRIMARY KEY(id));";
db.query(lsql, (err, results) => {
    if(err){console.log(err)};
    //console.log(results);
})

//let lsql = "CREATE TABLE IF NOT EXISTS links (id INT AUTO_INCREMENT, image VARCHAR(25), tour VARCHAR(25), position VARCHAR(2), x INT, y INT, z INT);";
//db.query(lsql, (err, results) => {
//    if(err){console.log(err)};
    //console.log(results);
//})

server.get("/", (req, res) => {
	res.sendFile('index.html');
});

server.post("/api/tours", (req, res) => {
	//const items = [{ name: "Test", img: "pdemo2.jpg" }, { name: "Test", img: "pdemo.jpg" }, { name: "Test", img: "pdemo2.jpg" }, { name: "Test", img: "pdemo2.jpg" }];
    //let sql = "SELECT DISTINCT on tour * FROM photos;";
	let sql = "SELECT * FROM images;";
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
	let sql = "SELECT * FROM images WHERE tour = '"+req.body.tour+"';";
    db.query(sql, (err, results) => {
        if(err){
			console.log(err);
			res.send({error: true, message: 'SQL Error', data: results});
		}else{
			res.send({error: true, message: 'Success', data: results});
		}	
    }); 
});

server.post("/api/update", (req, res) => {
	let d = req.body;
	if(d.key === KEY){
		let sql = "REPLACE INTO images (name, tour, date, iposition, nx, ny) VALUES('"+d.name+"','"+d.tour+"','"+d.date+"','"+d.iposition+"','"+d.nx+"','"+d.ny+"');";
    	db.query(sql, (err, results) => {
        	if(err){
				console.log(err);
				res.send({error: true, message: 'SQL Error', data: results});
			}else{
				//let psql = "UPDATE links SET iposition = "
				res.send({error: false, message: 'Success', data: results});
			}			
    	}); 
	}else{
		res.send({error: true, message:'Incorrect API Key'});
	}
});



server.post("/api/links", (req, res) => {
	//console.log('links');
	let sql = "SELECT * FROM links WHERE tour = '"+req.body.tour+"' AND iposition = '"+req.body.iposition+"' AND NOT lposition = '"+req.body.iposition+"';";
	db.query(sql, (err, results) =>{
		if(err){
			console.log(err);
			res.send({error: true, message: 'SQL Error', data: results});
		}else{
			res.send({error: false, message: 'Success', data: results});
		}
	})
});

server.post("/api/edit", (req, res) => {
	let b = req.body;
	console.log(b.positions);
	if (b.key === KEY) {
		b.positions.forEach((d)=>{
			//let lkey = d.tour+d.iposition+d.lposition;
			let sql1 = "REPLACE INTO links (tour, iposition, lposition, x, y, z) VALUES('" + d.tour + "','" + d.iposition + "','" + d.lposition + "','" + d.x + "','" + d.y + "','" + d.z + "');";
			let sql2 = "REPLACE INTO links (id, tour, iposition, lposition, x, y, z) VALUES('" + d.id + "','" + d.tour + "','" + d.iposition + "','" + d.lposition + "','" + d.x + "','" + d.y + "','" + d.z + "');";
			let sql = 'new' in d ? sql1 : sql2;
			db.query(sql, (err, results) => {
				//console.log(sql);
				//if (err) {
				//	console.log(err);
				//	res.send({ error: true, message: 'SQL Error', data: results });
				//} else {
				//	res.send({ error: false, message: 'Success', data: results });
				//}
			});
		})
		res.send({ error: false, message: 'Success' });
	}
});

server.post("/api/get", (req, res) => {
	let d = req.body;
	let sql = "SELECT * FROM images WHERE name = '"+d.name+"';";
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
