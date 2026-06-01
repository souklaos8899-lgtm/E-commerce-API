const jwt = require('jsonwebtoken')
const asyncHandler = require('../middleware/asyncHandler')
const User = require('../models/User')

const protect = async(req, res, next) => {
    try{
        let token


        if(
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ){
            token = req.headers.authorization.split(' ')[1]
        }
        
        if(!token){
            return res.status(401).json({
                success: false,
                message:'กรุณา login ให่ม'
            })
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id)
        
        next()
        
    }catch(error){
        res.status(401).json({
            success: false,
            message:'token ไม่ต้องหลืหนดอายุ'
        })
    }
}


const authorize = (...role) => {
    return (req, res, next) => {
        if(!role.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                message: `role ${req.user.role} ไม่มีสีดเข้าถืง`
            })
        }
        next()
    }
}



module.exports = {protect, authorize}

