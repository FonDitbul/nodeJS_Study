const db = require('../lib/db')
const bcrypt = require('bcrypt');


module.exports = function(app) {

    //세션 다음에 passport 가 실행되어야함.
    const passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize())
    app.use(passport.session())

    passport.serializeUser(function (user, done) {
        console.log('serial', user.id)
        done(null, user.id);

    })
    passport.deserializeUser(function (id, done) {
        const user = db.get('users').find({id:id}).value();
        console.log('deserialize', id, user)
        done(null, user);
    })

    passport.use('login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function (email, password, done) {
            // console.log('LocalStrategy', email, password);
            let user = db.get('users').find({
                email:email,
            }).value();
            if(user){
                bcrypt.compare(password, user.password, function(err, result){
                    if(result){
                        return done(null, user);
                    }else{
                        return done(null, false, {
                            message: 'Incorrect password'
                        })
                    }
                })
            }else{
                return done(null, false, {
                    message: 'There is no email'
                })
            }
        }
    ))
    return passport;
}
