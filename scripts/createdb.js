'use strict';
const config = require('../config/Config');
const fs = require('fs');

var mongoose = require('mongoose');
mongoose.connect(config.DB, { useNewUrlParser: true });

var { Vereadores, Prefeitos, Eleitores} = require('../models/Model');

let rawdata = fs.readFileSync(__dirname+'/Dados.json');  
let poll = JSON.parse(rawdata);  

var candidatos = poll["candidatos"];
var eleitores = poll["eleitores"];

var vereadores = candidatos["vereadores"];
var prefeitos  = candidatos["prefeitos"];

// function create(){
    console.log("> Adicionando VEREADORES\n");
    vereadores.forEach(vereador => {
        console.log("> Adicionando elemento: "+JSON.stringify(vereador)+" no banco ...");
        var data = new Vereadores(vereador);
        data.save();
        console.log("> Elemento adicionado!");
    });
    
    console.log("> Adicionando PREFEITOS\n");
    prefeitos.forEach(prefeito => {
        console.log("> Adicionando elemento: "+JSON.stringify(prefeito)+" no banco ...");
        var data = new Prefeitos(prefeito);
        data.save();
        console.log("> Elemento adicionado!");
    });
    
    console.log("> Adicionando ELEITORES\n");
    eleitores.forEach(eleitor => {
        console.log("> Adicionando elemento: "+JSON.stringify(eleitor)+" no banco ...");
        var data = new Eleitores(eleitor);
        data.save();
        console.log("> Elemento adicionado!");
    });
// }

// module.exports = create();