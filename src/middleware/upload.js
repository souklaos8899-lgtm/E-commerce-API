const multer = require('multer')

const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const filename = `product-${Date.now()}${path.extname(file.originalname)}`
        cb(null, filename)
    }
})

const filefilter = (req, file, cb) => {
    const allowedTypes = [`image/jpeg`, 'image/png', 'image/jpg']

    if(allowedTypes.includes(file.minetype)){
        cb(null, true)
    }else(
        cb(new Error('กรุณาอัปโหลดไฟล์รูปภาพ (.jpg, .jpeg, .png) เท่านั้น'), false)
    )
}

const upload = multer({
    storage,
    filefilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})


module.exports = upload