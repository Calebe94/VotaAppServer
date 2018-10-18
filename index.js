var express = require('express');
var app = express(); 
var bodyParser = require('body-parser');

app.listen(8080);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var email;
var senha;

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE');    
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function(req, res) {
	res.send('Servidor ON!');
  //res.sendFile('index.html');
});

app.post("/api/auth/", function(req, res){
  console.log(req.body);
  // res.send(req.body);
  res.send({ username: true, password: true});
});
