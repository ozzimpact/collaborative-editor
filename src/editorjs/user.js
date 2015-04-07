(function () {
    'use strict';

    var mongoose = require('mongoose');
    var bcrypt = require('bcrypt-nodejs');
    var userSchema = mongoose.Schema({

        local: {
            email: String,
            password: String,
            date: {type: Date, default: Date.now}
        }

    }, {collection: 'ac_user'});


    userSchema.methods.generateHash = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    userSchema.methods.validPassword = function (password) {
        return bcrypt.compareSync(password, this.local.password);
    };

    module.exports = mongoose.model('User', userSchema);
})();