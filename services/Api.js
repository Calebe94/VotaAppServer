var express = require('express')

var api_routes = express.Router()

var {Vereadores, Prefeitos, Eleitores} = require('../models/Model');

api_routes.route('/auth').post(function(req, res){
    res.send({ auth: true});
});

api_routes.route('/add/:type').post(function(req, res){
    console.log(req.params.type);
    res.send({ status:"deu boa?"});
});

api_routes.route('/candidatos/:type').get(function(req, res){
    console.log(req.params.type);
    res.send({ prefeito: "Mr Foda-se!"});
});

api_routes.route('/votar').post(function(req, res){
    console.log(JSON.stringify(req.body));
    res.send({ status:"true"});
});

module.exports = api_routes;