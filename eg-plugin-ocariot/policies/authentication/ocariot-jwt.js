const passport = require('passport');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

module.exports = function (actionParams) {

    const secretOrKey = actionParams.secretOrPublicKeyFile ? fs.readFileSync(actionParams.secretOrPublicKeyFile) : actionParams.secretOrPublicKey;

    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: secretOrKey,
        issuer: actionParams.issuer
    }, (jwtPayload, cb) => {

        console.log(`JWT payload: ${JSON.stringify(jwtPayload)}`);
        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        var err = new Error('Authentication failed');
        err.status = 400;
        return cb(null,{username: "alex"});
    }
    ));

    return (req, res, next) => {
        console.log('executing ocariot authentication policy with params', actionParams);
        passport.authenticate('jwt', {session: false})(req, res, next);
    }
};