//This Function checks if the user is a legitimate user 
//in the database once the token is decoded
//PROTECTED ROUTING
const passportJWT = require('passport-jwt');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const config = require('./main')

const Op = Sequelize.Op;
const passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    User = require('../User/model'),
    JwtStrategy = passportJWT.Strategy,
    ExtractJwt = passportJWT.ExtractJwt;


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("jwt"),
    secretOrKey: config.secret
};

const jwt = new JwtStrategy(opts, (payload, done) => {
    User.findOne({
        where: {
            id: payload.id
        }
    }).then(user => {
        if (user) {
            console.log("User found in db at passport")
            return done(null, user)
        }
        else {
            console.log("User not  found in db at passport")
            return done(null, false)
        }
    }).catch(err => console.error(err))
});

passport.use(jwt);