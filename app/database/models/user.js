const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

// incorrect!!! This approach bypasses password validation (required and minLength)
/*
UserSchema.path('password').set(password => {
    const salt = bcrypt.genSaltSync(10);            // getSalt is async
    const hash = bcrypt.hashSync(password, salt);   // as well as hash
    return hash;
});
*/

// pre - just before saving user to DB
UserSchema.pre('password', function(next) {
    const user = this;
    const salt = bcrypt.genSaltSync(10);            // getSalt is async
    const hash = bcrypt.hashSync(password, salt);   // as well as hash
    user.password = hash; // after validation set password to it's hash
    next();
});

UserSchema.post('save', function (err, doc, next)  {
    if (err.code === 11000) {
        err.errors = {email: {message: "Podany email jest już używany."}};
    };
    next(err);
});

const User = mongoose.model('User', UserSchema);

module.exports = User;