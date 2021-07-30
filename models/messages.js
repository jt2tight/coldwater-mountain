const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const messagesSchema = new Schema({
    email: {
        type: String,
    
    },

    subject: {
        type: String,
    },
    message: {
        type: String,
    }

});

module.exports = mongoose.model('Message', messagesSchema)