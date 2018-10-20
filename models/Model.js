var mongoose = require('mongoose')

// Define collection and schema for candidatos Item

var candidato = new mongoose.Schema(
    {
        nome: String,
        partido: String,
        foto: String
    }
);

var eleitor = new mongoose.Schema(
    {
        nome: String,
        titulo: String,
        senha: String
    }
);

var Vereadores = mongoose.model('vereadores', candidato);
var Prefeitos  = mongoose.model('prefeitos', candidato);
var Eleitores  = mongoose.model('eleitores', eleitor);

module.exports = {Vereadores, Prefeitos, Eleitores};
// module.exports = mongoose.model('vota_app', todo);