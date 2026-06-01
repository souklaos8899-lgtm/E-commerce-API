const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('../middleware/asyncHandler')

const generateToken = (id) => {
    return jwt.sign(
        {id},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRE}
    )
}


const register = asyncHandler(async(req, res, next) => {

    const {name, email, password} = req.body
    const exitinguser = await User.findOne({email})
    
    
    if(exitinguser){
        const error = new Error('email นี้มีอยู่ในระบบ')
        statusCode = 400
        return next(error)
    }
    
    const salt = await bcrypt.genSalt(10)
    const hashedpassword = await bcrypt.hash(password, salt)
    
    
    const user = await User.create({
        name,
        email,
        password: hashedpassword
    })
    
    const token = generateToken(user._id)
    res.status(201).json({
        success: true,
        message: 'สร้าง user สำเร็จ',
        token,
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    })
})


const login = asyncHandler(async(req, res, next) => {
    const {email, password} = req.body
    if(!email || !password){
        const error = new Error(`กรุณากรอก email, password`)
        statusCode = 400
        return next(error)
    }

    const user = await User.findOne({email}).select('+password')

    if(!user){
        const error = new Error('email หลื password ไม่ถูกต้อง')
        statusCode = 400
        return next(error) 
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        const error = new Error('email หลื password ไม่ถืกต้อง')
        statusCode = 400
        return next(error)
    }

    const token = generateToken(user._id)
    res.status(200).json({
        success: true,
        message: 'login สำเร็จ',
        token,
        data: {
            id: user._id,
            name: user.name, 
            email: user.email,
            role: user.role
        }
    })
})


const getMe = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        data: user
    })
})

module.exports = {
    register,
    login,
    getMe
}