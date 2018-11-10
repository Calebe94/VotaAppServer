var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

// Define collection and schema for candidatos Item
var candidato = new mongoose.Schema(
    {
        nome: { type:String },
        partido: { type:String },
        foto: { type:String },
        votos: { type:Number,default:0 }
    }
);

var eleitor = new mongoose.Schema(
    {
        nome: { type:String },
        titulo: { type:String },
        senha: { type:String },
        votou: { type:Number,default:0 },
        vereador: {type: String},
        prefeito: { type: String}
    }
);

var Vereadores = mongoose.model('vereadores', candidato);
var Prefeitos  = mongoose.model('prefeitos', candidato);
var Eleitores  = mongoose.model('eleitores', eleitor);

module.exports = {Vereadores, Prefeitos, Eleitores};