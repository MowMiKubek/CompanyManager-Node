const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {isEmail} = require('../validators');

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email jest wymagany"],
        lowercase: true,
        trim: true,
        unique: [true, "Podany email jest już zajęty"],
        validate: [value => isEmail(value), "Podaj poprawny email"]
    },
    password: {
        type: String,
        required: [true, "Hasło jest wymagane"],
        minLength: [4, "Minimalna długość hasła to 4"]
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;