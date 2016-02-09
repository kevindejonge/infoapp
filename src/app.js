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

app.get('/users/searchbar', function(request, response) {
	response.render('users/searchbar');
});


app.post('/users/searchbar', bodyParser.urlencoded({
	extended: true
}), function(request, response) {
	fs.readFile('./users.json', function(error, data) {
		if (error) {
			console.log(error);
		} else if (true) {
			var parsedData = JSON.parse(data);
			var inputname = request.body.firstname;
			var results = [];

			var count = 0;
			for (var i = 0; i < parsedData.length; i++) {
				var babam = parsedData[i].firstname;
				var username = babam.toLowerCase();

				if (username.indexOf(inputname) >= 0) {
					results.push(babam)
					count++

					if (count === parsedData.length) {
						if (results.length === parsedData.length) {
							results = []
						};


						response.send({
							object: results
						});
					}
				} else {
					count++

					if (count === parsedData.length) {
						if (results.length === 0) {
							results = ['no match']
						};
						response.send({
							object: results
						});
					}

				};


			};
		}



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