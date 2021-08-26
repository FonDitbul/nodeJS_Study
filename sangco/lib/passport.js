const db = require('../lib/db')

module.exports = function(app) {
    // const authData = {
    //     email: 'niki7084@naver.com',
    //     password: 'sk7083',
    //     nickname: 'FADFAD'
    // }

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
            console.log('LocalStrategy', email, password);
            let user = db.get('users').find({
                email:email,
                password:password
            }).value();
            if(user){
                return done(null, user);
            }else{
                return done(null, false, {
                    message: 'Incorrect.'
                })
            }
        }
    ))
    return passport;
}
