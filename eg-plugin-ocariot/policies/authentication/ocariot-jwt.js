const passport = require('passport');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const services = require('express-gateway/lib/services');

module.exports = function (actionParams) {

    const secretOrKey = actionParams.secretOrPublicKeyFile ? fs.readFileSync(actionParams.secretOrPublicKeyFile) : actionParams.secretOrPublicKey;

    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: secretOrKey,
        issuer: actionParams.issuer
    }, (jwtPayload, done) => {
        //At this point both the jwt signature, issuer and experation were validated
        // Futhermore, we have the jwt payload decoded and we can access its attributes
        console.log(`JWT payload: ${JSON.stringify(jwtPayload)}`);

        //User validation. We expect to receive the username in the jwt 'sub' field
        if (!jwtPayload.sub) {
            return done(null, false);
        }
        services.auth.validateConsumer(jwtPayload.sub, { checkUsername: true })
            .then((consumer) => {
                if (!consumer) {
                    return done(null, false); //invalid username or inctive user
                }
                return done(null, jwtPayload); //jwt successfully authenticated
            }).catch((err) => {
                if (err.message === 'CREDENTIAL_NOT_FOUND') {
                    return done(null, false);
                }
                return done(err);
            });       
    }
    ));

    return (req, res, next) => {
        console.log('executing ocariot authentication policy with params', actionParams);
        passport.authenticate('jwt', { session: false })(req, res, next);
    }
};