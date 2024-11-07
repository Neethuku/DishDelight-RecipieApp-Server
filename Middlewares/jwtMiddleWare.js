const jwt = require('jsonwebtoken')

const jwtMiddleware = (req,res,next) => {
    try {
        const token = req.headers['authorization'].split(" ")[1]
        if(token){
            const jwtResponse = jwt.verify(token,process.env.jwt_secretkey)
            req.payload = { userId: jwtResponse.userId, isAdmin: jwtResponse.isAdmin };     
                   next()
        }else{
            res.status(401).json("Please provide token")
        }
    } catch (error) {
      res.status(403).json("Please login")  
    }
}

module.exports = jwtMiddleware