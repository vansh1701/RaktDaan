const jwt = require("jsonwebtoken");
const Signuph = require("../models/signuph");



const auth1 = async (req,res,next) =>{
    try {
        const token = req.cookies.jwt;
        const verifyuser = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(verifyuser);
        const user = await Signuph.findOne({_id:verifyuser._id});
        // console.log(user); 
        res.user=user;
        next();
    } catch (error) {
        res.status(401).send(error);
    }
}

module.exports = auth1;