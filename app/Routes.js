
var express = require('express')

var api_routes = express.Router()

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

module.exports = api_routes;