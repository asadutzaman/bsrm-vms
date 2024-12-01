const jwt = require('jsonwebtoken')

const authBackend = (req, res, next) =>{
    try {
        // const token = req.header("Authorization");
        // if(!token) return res.status(400).json({msg: "Invalid Authentication"});

        const rf_token = req.cookies.refreshtoken;
            if(!rf_token) return res.redirect('/');

        jwt.verify(rf_token,process.env.REFRESH_TOKEN_SECRET,(err, user) =>{
            if(err) return res.status(400).json({msg: "Invalid Authentication"});

            req.user = user;
            next();
        })
    } catch (err) {
        return res.status(500).json({msg: err.message});
    }
}

module.exports = authBackend;