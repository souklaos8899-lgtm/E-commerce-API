const limit = require('express-rate-limit')


const limiter = limit.rateLimit({
    windowMs: 15 * 60 * 1000,
    max:100,
    message: {
        success: false,
        message: 'ส่ง request มาเยอะเกีนไป'
    }
})

module.exports = limiter