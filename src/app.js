var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');

app.set('views', './src/views');
app.set('view engine', 'jade');


app.get('/', function(request, response) {
	fs.readFile('./users.json', function(error, data) {
		if (error) {
			console.log(error);
		}
		var parsedData = JSON.parse(data);
		console.log('users read: ' + parsedData.length + " users loaded G.");

		response.render('index', {
			users: parsedData
		});
	});
});


app.get('/users/search', function(request, response) {
	response.render('users/search');
});


app.post('/users/search', bodyParser.urlencoded({
	extended: true
}), function(request, response) {
	fs.readFile('./users.json', function(error, data) {
		if (error) {
			console.log(error);
		}

		var parsedData = JSON.parse(data);
		var counter = 0;

		for (i = 0; i < parsedData.length; i++) {
			if (parsedData[i].firstname === request.body.firstname ||
				parsedData[i].lastname === request.body.lastname) {
				counter++
				response.render('users/user', {
					users: parsedData[i]
				})

			} else if (i === parsedData.length - 1 && counter === 0) {
				console.log('/user/what')
				response.render('users/what')
			}
		};
	});
});

app.get('/users/new', function(request, response) {
	response.render('users/new');
});

app.post('/users', bodyParser.urlencoded({
	extended: true
}), function(request, response) {

	var newUser = new user(
		request.body.firstname,
		request.body.lastname,
		request.body.email
	)


	function user(firstname, lastname, email) {
		this.firstname = firstname;
		this.lastname = lastname;
		this.email = email;

		var aNewUser = this

		fs.readFile('./users.json', function(error, data) {
			if (error) {
				console.log("Somethings is going wrong G");
			}
			var DataNewUser = JSON.parse(data);

			DataNewUser.push(aNewUser)

			var newUserStringified = JSON.stringify(DataNewUser)

			fs.writeFile('./users.json', newUserStringified, function(error) {
				console.log("user created G")
				if (error) {
					throw error;
				}
				response.redirect('/')
			})
		})
	};
});



var server = app.listen(3000, function() {
	console.log('Example app listening on port: ' + server.address().port);
})