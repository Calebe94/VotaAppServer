var express = require('express');
var app = express(); 
var bodyParser = require('body-parser');

var mongoose = require('mongoose');

var routes = require('./services/Routes');

const config = require('./config/Config');

var { Prefeitos, Vereadores, Eleitores } = require('./models/Model');

// var createDb = require('./scripts/createdb');


mongoose.connect(config.DB, { useNewUrlParser: true }, function(error, databese){
  if(error) throw error;
  else{
    databese.db.listCollections({name: 'vereadores'}).next(function(err, collections) {
      
      if(collections)
      {
        console.log("> Conectado ao banco com sucesso!");
      }
      else
      {
        var createdb = require('./scripts/createdb');
      }
    });
  }
});

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

