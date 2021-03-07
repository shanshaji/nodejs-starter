const jwt = require("jsonwebtoken")

const isAuth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace("Bearer ", "")
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.token = token
        req.userId = decoded._id
        next()
    }catch(e){
        res.status(401).send({error: `Please Authenticate ${req.header}`})
    }
}

module.exports = isAuth