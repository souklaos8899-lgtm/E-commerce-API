const Order = require('../models/Order')
const Cart = require('../models/Cart')
const Product = require('../models/Product')
const asyncHandler = require('../middleware/asyncHandler')


const getMyorder = asyncHandler(async(req, res) => {
    
    const order = await Order.find({user: req.user.id}) //หาทุก order ของ user นี้
    res.status(200).json({
        success: true,
        count: order.length,
        data: order
    })
})


const getAllOrder = asyncHandler(async(req, res) => {
    const order = await Order.find()

    res.status(200).json({
        success: true,
        count: order.length,
        data: order
    })
})


const getOrderById = asyncHandler(async(req, res, next) => {
    const order = await Order.findById(req.params.id)
    if(!order){
        const err = new Error('ไม่พบ order นี้')
        err.statusCode = 404
        return next(err)
    }

    res.status(200).json({
        success: true,
        data: order
    })
})


const createOrder = asyncHandler(async(req, res, next) => {
    const {shippingAddress } = req.body


    const cart = await Cart.findOne({user: req.user.id})
    if(!cart || cart.items.length === 0){
        const err = new Error('ตะกล้าว่างเป่า')
        err.statusCode = 400
        return next(err)
    }

    for(const item of cart.items){
        const product = await Product.findById(item.product)
        if(product.stock < item.quantity){
            const err = new Error(`สีนค้า ${product.name} มีไม่พอ`)
            err.statusCode = 400
            return next(err)
        }
    }

    const order = await Order.create({
        user: req.user.id,
        items: cart.items,
        shippingAddress,
        totalPrice: cart.totalPrice,
        status: 'pending'
    })


    for (const item of cart.items){
        await Product.findByIdAndUpdate(item.product, {
            $inc: {stock: -item.quantity}
        })
    }

    cart.items = []
    cart.totalPrice = 0
    await cart.save()

    res.status(201).json({
        success: true,
        message: 'ส้างออเดอร์สำเร็จ',
        data: order
    })
})


const updateStatus = asyncHandler(async(req, res, next) => {
    const {status} = req.body

    const order = await Order.findById(req.params.id)
    if(!order){
        const err = new Error('ไม่พบออเดอร์นี้')
        err.statusCode = 404
        return next(err)
    }

    if(order.status === 'delivered' || order.status === 'cancelled'){
        const err = new Error(`ไม่สามารถเปื่ยนแปลงสถานะจาก ${order.status} ได้`)
        err.statusCode = 400
        return next(err)
    }

    order.status = status
    await order.save()
    res.status(200).json({
        success: true,
        message: `อัปเดตสถานะเป็น ${status} สำเร็จ`,
        data: order
    })
})

const cancelOrder = asyncHandler(async(req, res, next) => {
    const order = await Order.findById(req.params.id)

    if(!order){
        const err = new Error ('ไม่พบ id นี้')
        err.statusCode = 404
        return next(err)
    }

    if(order.status !== 'pending'){
        const err = new Error('ยกเลิกได้แค่ตอนสถานะ pending เท่านั้น')
        err.statusCode = 400
        return next(err)
    }

    for(const item of order.items){
        await Product.findByIdAndUpdate(item.product, {
            $inc:{ stock: +item.quantity}
        })
    }


    order.status = 'cancelled'
    await order.save()

    res.status(200).json({
        success: true,
        message: 'ยกเลีกออเดอร์สำเร็จ',
        data: order
    })
})


module.exports ={
    getAllOrder,
    getMyorder,
    getOrderById,
    cancelOrder,
    createOrder,
    updateStatus
}

