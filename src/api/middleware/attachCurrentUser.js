const User = require("../../models/user")
const attachCurrentUser = async (req, res, next) => {
    try{
        const user = await User.findOne({_id: req.userId, 'tokens.token': req.token})
        if(!user){
            throw new Error()
        }
        req.user = user
        next()
    }catch(e){
        res.status(404).send({error: "Could not find user"})
    }
}

module.exports = attachCurrentUser