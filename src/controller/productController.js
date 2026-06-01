const Product = require('../models/Product')
const asyncHandler = require('../middleware/asyncHandler')


const getProduct = asyncHandler(async(req, res) => {

    let querystr = JSON.stringify(req.query)

    querystr = querystr.replace(
        /\b(gte|lte|gt|lt)\b/g,

        match => `$${match}`
    )

    let query = JSON.parse(querystr)


    if(req.query.search){
        query.name = {
            $regex: req.query.search,
            $options: 'i'
        }
    }

    const removefield = ['search', 'sort', 'page', 'limit']
    removefield.forEach(field => delete query[field])


    let sortBy = '-createdAt'
    if(req.query.sort){
        sortBy = req.query.sort.split(',').join(' ')
    }


    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const total = await Product.countDocuments(query)
    const products = await Product
        .find(query)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)



    const totalpage = Math.ceil(total / limit)
    const hasNext = page < totalpage
    const hasPrev = page > 1



    res.status(200).json({
        success: true,
        total,
        count: products.length,
        page,
        totalpage,
        hasNext,
        hasPrev,
        data:products
    })
})


const getProductById = asyncHandler(async(req, res, next) => {
    const products = await Product.findById(req.params.id)
    if(!products){
        const error = new Error (`ไม่พบ Prouduct id: ${req.params.id}`)
        err.statusCode = 404
        return next(error)
    }


    res.status(200).json({
        success: true,
        data: products
    })
})



const createProduct = asyncHandler(async(req, res) => {
    const products = await Product.create({...req.body, createdBy: req.user.id})

    res.status(201).json({
        success: true,
        message: 'สร้างสำเร็จ',
        data: products
    })
})


const updateProduct = asyncHandler(async(req, res, next) => {
    const products = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    )

    if(!products){
        const err = new Error(`ไม่พบ product id: ${req.params.id}`)
        err.statusCode = 404
        return next(err)
    }

    res.status(200).json({
        success: true,
        data: products
    })
})


const deleteProduct = asyncHandler(async(req, res, next) => {
    const products = await Product.findByIdAndDelete(req.params.id)
    if(!products){
        const err = new Error(`ไม่พบ product id: ${req.params.id}`)
        err.statusCode = 404
        return next(err)
    }
})



const uploadImage = asyncHandler(async(req, res, next) => {
    const products = await Product.findById(req.params.id)

    if(!products){
        const err = new Error(`ไม่พบ product id: ${req.params.id}`)
        err.statusCode = 404
        return next(err)
    }

    if(!req.file){
        const error = new Error('กรุณาเลือกไไฟล์รูปภาพ')
        statusCode = 404
        return next(error)
    }

    res.status(200).json({
        success:true,
        message:'อัปโหลดรูปภาพสำเร็จ',
        data: products
    })
})


module.exports = {
    getProduct,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage
}