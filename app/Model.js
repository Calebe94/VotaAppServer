var mongoose = require('mongoose')

// Define collection and schema for todo Item

var todo = new mongoose.Schema({
    name: {
        type: String
    },

    done: {
        type: Boolean
    }
},
{
    collection: 'candidatos'
});

module.exports = mongoose.model('vota_app', todo);