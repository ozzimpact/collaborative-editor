// config/database.js

var mongoose = require('mongoose');


var editorSchema = new mongoose.Schema({
    userMail: String,
    text: String,
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Editor', editorSchema);


module.exports = {

    url: 'mongodb://localhost:27017/CollaborativeEditor'

};
