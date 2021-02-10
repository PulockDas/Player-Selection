const jwt = require('jsonwebtoken');

const auth = async (req,res,next)=>{
    try {

        console.log(req.cookies.jwt);

        const token = req.cookies.jwt;
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message:'you are unauthorized to load the page!'
        });
    }
};

module.exports = auth;