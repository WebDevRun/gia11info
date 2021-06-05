import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
dotenv.config('.env')

export default function (roles) {
  return function (req, res, next) {
    if (req.method === 'OPTIONS') {
      next()
    }
  
    try {
      const token = req.headers.authorization?.split(' ')[1]
      if (!token) {
        return res.status(401).json({message: 'The user is not logged in'})
      }
      const decodedData = jwt.verify(token, process.env.SECRET_KEY)
      let hasRoles = false
      decodedData.roles.forEach(role => {
        if (roles.includes(role)) {
          hasRoles = true
        }
      });
      if (!hasRoles) {
        return res.status(403).json({message: "You don't have access"})
      }
      next()
    } catch (error) {
      return res.status(403).json({message: 'The user is not logged in'})
    }
  }
}