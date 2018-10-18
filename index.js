var express = require('express');
var app = express(); 
var bodyParser = require('body-parser');

var path = require("path");

// var MongoClient = require('mongodb').MongoClient;
// var mongo = require('mongodb');

// var mongoose = require('mongoose');

var routes = require('./app/Routes');

const config = require('./app/Config');

// mongoose.connect(config.DB);

app.listen(config.PORT);

console.log("> Server running on port: http://localhost:"+config.PORT);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/api', routes);

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE');    
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get('/', function(req, res) {
	res.send('Servidor Online!');
  //res.sendFile('index.html');
});

app.post("/api/auth/", function(req, res){
  console.log(req.body);
  // res.send(req.body);
  res.send({ username: true, password: true});
});
