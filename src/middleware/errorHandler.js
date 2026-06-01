




const errorHandler = (err, req, res, next) => {
    
    let error = {...err}
    error.message = error.message
    console.error('X Error:', err.message)



    if(err.name === 'CastError'){
        err.massage = `ไม่พบข้อมูน id: ${err.value}`,
        statusCode = 404
    }

    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(e => e.message)
        err.message = message.join(',')
        statusCode = 401
    }

    if(err.code === 11000) {
        const field = Object.keys(err.keyvalue)[0]
        err.message = `${field} นี้มีในระบบแล้ว`
        statusCode - 400
    }

    if(err.name === 'JsonWebTokenError'){
        error.message = 'Token ไม่ถูกต้อง',
        statusCode = 401
    }

    if(err.name === 'TokenExprisedError'){
        err.message = 'Token หนดอายุ'
        statusCode = 401
    }


    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'เกีดข้อผีดพาดใน server'
    })
}

module.exports = errorHandler