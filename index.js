const express = require('express');
const sqlite3 = require('sqlite3').verbose();

// open the database
function connect(){
	const db = new sqlite3.Database('Users.db', sqlite3.OPEN_READONLY, (err) => {
		if (err) {
			console.error(err.message);
		} else {
			console.log('Connected to database.');
		}
	});
	return db;
}

// close the database
function close(db){
	db.close((err) => {
		if (err) {
			console.error(err.message);
		} else{
			console.log('Closed the database connection.\n');
		}
	});
}

function lookup(Uname, password) {
	var valid;
	db = connect();

	let sql = `
	SELECT Uname, password 
	FROM Users WHERE Uname == '` + Uname + `'`;

	db.all(sql, (err, rows) => {
		if (err) {
			console.error(err.message);
		} else {
			if (rows.length != 0) {
				rows.forEach((row) => {
					if (row.Uname == Uname && row.password == password) {
						valid = true;
					}
				})
			} else {
				console.log(false);
				valid = false;
			}
			close(db);
			console.log(valid);
			return valid;
		}
	});
}	



// app stuff
const app = express();

app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({limit: '1mb' }));

// get data from server
//app.get('/api', (request, response) => {
//	var valid;
//	console.log("Sending data to client\n");
//	response.send("Response");
//});

// send data to server
app.post('/api', (request, response) => {
	console.log('I got a request');
	const data = request.body;
	console.log(data);
	var Uname = data.Uname;
	var password = data.password;

	var valid;
	var email;
	db = connect();

	let sql = `
	SELECT Uname, password, email 
	FROM Users WHERE Uname == '` + Uname + `'`;

	db.all(sql, (err, rows) => {
		if (err) {
			console.error(err.message);
		} else {
			if (rows.length != 0) {
				rows.forEach((row) => {
					if (row.Uname == Uname && row.password == password) {
						valid = true;
						name = row.Uname;
						password = row.password;
						email = row.email;
					}
				})
			} else {
				valid = false;
			}
			close(db);
			console.log(valid);
			if (valid) {
				console.log("Sending data to client\n");
				var text = `Hi ` + name + ` your email is ` + email + `.`;
				response.send(text);
			} else {
				console.log("Sending data to client\n");
				response.send("Invalid Username of password.");
			}
		}
	});
});