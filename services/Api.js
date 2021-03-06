var express = require('express')

var api_routes = express.Router()

var {Vereadores, Prefeitos, Eleitores} = require('../models/Model');

api_routes.route('/auth').post(function(req, res){
    Eleitores.findOne({titulo: req.body.username}).exec(function(error, eleitor){
        // console.log(eleitor.prefeito)
        try
        {
            if(eleitor.senha == req.body.password)
            {
                if( eleitor.votou == 1 || eleitor.votou == "1")
                {
                    // Prefeitos.findOne(inteleitor.prefeito), function (err, prefeito_db) { 
                    Prefeitos.findById({ _id: eleitor.prefeito }).exec(function(error, prefeito_db){
                        console.log(prefeito_db);
                        Vereadores.findOne({ _id: eleitor.vereador }).exec(function(error, vereador_db){
                            console.log(vereador_db);
                            res.send({ auth: true , votou: eleitor.votou, prefeito: prefeito_db, vereador: vereador_db});
                        });
                    });
                }
                else
                {
                    res.send({ auth: true , votou: eleitor.votou });
                }
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

    Eleitores.findOne({ titulo: req.body.eleitor }, function(error, response){
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
            // {
            //     "eleitor": "id_eleitor",
            //     "vereador": "id_vereador",
            //     "prefeito": "id_prefeito"
            // }
            Vereadores.findOneAndUpdate({ _id: req.body.vereador }, { $inc: { votos: 1 } },function(error, response) {
                if (error) 
                {
                    console.log("> Error: "+error)
                    res.send( { status: false });
                } 
                else 
                {
                    Prefeitos.findOneAndUpdate({ _id: req.body.prefeito }, { $inc: { votos: 1 } },function(error, response) {
                        if (error) 
                        {
                            console.log("> Error: "+error)
                            res.send( { status: false });
                        } 
                        else 
                        {
                            // console.log("> "+response);
                            Eleitores.findOneAndUpdate({ titulo: req.body.eleitor }, {$bit: {votou: {xor: 1}}, vereador: req.body.vereador, prefeito: req.body.prefeito  }, function(error, response){
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
            });
        }
            
    });
});

module.exports = api_routes;