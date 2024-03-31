require('dotenv').config();
const jwt = require("jsonwebtoken")

const isThisToken = async (req, res, next) => {
    const token = req?.cookies?.mdhuzaifa;
    if (!token) {
        return res.status(401).send({ message: "Unauthorized" })
    }
    jwt.verify(token, process.env.TOKEN, (error, decoded) => {
        if (error) {
            return res.status(401).send({ message: "Unauthorized" })
        }
        req.user = decoded
        next()
    })
}

module.exports = {
    isThisToken
}