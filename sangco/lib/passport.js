

module.exports = function(app) {
    const authData = {
        email: 'niki7084@naver.com',
        password: 'sk7083',
        nickname: 'FADFAD'
    }

    //세션 다음에 passport 가 실행되어야함.
    const passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy;
    app.use(passport.initialize())
    app.use(passport.session())

    passport.serializeUser(function (user, done) {
        // console.log('serial', user.email)
        done(null, user.email);

    })
    passport.deserializeUser(function (id, done) {
        // console.log('deserialize', id)
        done(null, authData);
    })

    passport.use('login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function (username, password, done) {
            // console.log('LocalStrategy', username, password);
            if (username === authData.email) {
                if (password === authData.password) {
                    return done(null, authData);
                } else {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    })
                }
            } else {
                return done(null, false, {
                    message: 'Incorrect username.'
                })
            }
        }
    ))
    return passport;
}
