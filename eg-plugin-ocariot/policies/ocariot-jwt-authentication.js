module.exports = plugin;
const jwt = require('jsonwebtoken');
const fs = require('fs');
const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const extractors = require('./extractors');
const services = require('../../services');


module.exports = {
	name: 'jwtAuth',
	policy: (params) => {
		return (req, res, next) => {
			const secretOrKey = params.secretOrPublicKeyFile ? fs.readFileSync(params.secretOrPublicKeyFile) : params.secretOrPublicKey;
			const extractor = extractors[params.jwtExtractor](params.jwtExtractorField);
			
			passport.use(new JWTStrategy({ //options, verify(jwt_payload, done)
			secretOrKey,
			jwtFromRequest: extractor,
			audience: params.audience,
			issuer: params.issuer
		}, (jwtPayload, done) => {
			if (!jwtPayload) {
				return done(null, false);
			}

			//if(jwtPayload.issuer != 'ocariot'){
			//	return done(null, false);
			//}

			if (!jwtPayload.sub) {
				return done(null, false);
			}

			if(jwtPayload.jwtFromRequest) {
				jwt.verify(jwtPayload.jwtFromRequest, jwtPayload.secretOrKey, function (err) {
					if(err) {
						res.status(403).json({message: err.message}).end();
					}
					else {
						services.auth.validateConsumer(jwtPayload.sub, {checkUsername : true})
						.then((consumer) => {
							if (!consumer) {
								return done(null, false);
							}

							return done(null, consumer);
						}).catch((err) => {
							if (err.message === 'CREDENTIAL_NOT_FOUND') {
								return done(null, false);
							}
							return done(err);
						});
					}
				})
			}
			else {
				res.status(403).json({message: 'No token provided'}).end();
			}
			
			}));
		};
	}
};