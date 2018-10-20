var express = require('express')

var api_routes = express.Router()

var {Vereadores, Prefeitos, Eleitores} = require('../models/Model');

api_routes.route('/auth').post(function(req, res){
    Eleitores.findOne({titulo: req.body.username}).exec(function(error, eleitor){
        try
        {
            if(eleitor.senha == req.body.password)
            {
                res.send({ auth: true });
            }
            else
            {
                res.send({ auth: false });
            }
        }
        catch(error)
        {
            res.send({ auth: false });
        }
    });
});

api_routes.route('/add/:type').post(function(req, res){
    if(req.params.type == "vereador")
    {
        console.log("> Adicionando novo Vereador: "+JSON.stringify(req.body)+" no banco ...");
        var data = new Vereadores(req.body);
        data.save();
        console.log("> Vereador adicionado!");
        res.send({ status: true });
    }
    else if(req.params.type == "prefeito")
    {
        console.log("> Adicionando novo Prefeito: "+JSON.stringify(req.body)+" no banco ...");
        var data = new Prefeitos(req.body);
        data.save();
        console.log("> Prefeito adicionado!");
        res.send({ status: true });
    }
    else
    {
        res.send({ status: false });
    }
});

api_routes.route('/candidatos/:type').get(function(req, res){
    if(req.params.type == "vereador")
    {
        Vereadores.find({}, function(error, vereadores){
            if(error)
            {
                res.send({ status: false });
            }
            else
            {
                res.send(vereadores);
            }
        }); 
    }
    else if( req.params.type == "prefeito")
    {
        Prefeitos.find({}, function(error, prefeitos){
            if(error)
            {
                res.send({ status: false });
            }
            else
            {
                res.send(prefeitos);
            }
        });
    }
    else
    {
        res.send({ status: false });
    }
});

api_routes.route('/votar').post(function(req, res){

    Eleitores.findById({ _id: req.body.id_eleitor }, function(error, response){
        if(error)
        {
            res.send( { status: false });
        }
        else if( response["votou"] == true )
        {
            console.log("> Eleitor já votou!");
            res.send( { status: false });
        }
        else
        {
            if(req.body.type == "vereador")
            {
                Vereadores.findOneAndUpdate({ _id: req.body.id_candidato }, { $inc: { votos: 1 } },function(error, response) {
                    if (error) 
                    {
                        console.log("> Error: "+error)
                    } 
                    else 
                    {
                        Eleitores.findOneAndUpdate({ _id: req.body.id_eleitor }, {$bit: {votou: {xor: 1}} }, function(error, response){
                            if (error)
                            {
                                console.log("> Error: "+error);
                                res.send( { status: false });
                            }
                            else
                            {
                                console.log("> Voto confirmado !");
                                res.send( { status: true });
                            }
                        });
                    }
                });
            }
            else if(req.body.type == "prefeito")
            {
                Prefeitos.findOneAndUpdate({ _id: req.body.id_candidato }, { $inc: { votos: 1 } },function(error, response) {
                    if (error) 
                    {
                        console.log("> Error: "+error)
                        res.send( { status: false });
                    } 
                    else 
                    {
                        // console.log("> "+response);
                        Eleitores.findOneAndUpdate({ _id: req.body.id_eleitor }, {$bit: {votou: {xor: 1}} }, function(error, response){
                            if (error)
                            {
                                console.log("> Error: "+error);
                                res.send( { status: false });
                            }
                            else
                            {
                                res.send( { status: true });
                                console.log("> Voto confirmado !");
                            }
                        });
                    }
                });
            }
            else
            {
                res.send( { status: false });
            }   
        }
    });
});

module.exports = api_routes;