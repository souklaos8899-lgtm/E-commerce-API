const Cart = require('../models/Cart')
const asyncHandler = require('../middleware/asyncHandler')
const Product = require('../models/Product')



// ─── GET CART — ดูตะกร้าของตัวเอง ────────────────
const getCart = asyncHandler(async(req, res) => {

    let cart = await Cart.findOne({user: req.user.id})

    if(!cart){
        cart = await Cart.create({
            user: req.user.id,
            item: [],
            totalPrice: 0
        })
    }
    res.status(200).json({
        success: true,
        data: cart
    })
})

// เพิ่ม item เข้า array
const addToCart = asyncHandler(async(req, res, next) => {
    const {productId, quantity } = req.body

    const product = await Product.findById(productId)
    if(!product){
        const err = new Error('ไม่พบสีนค้านี้')
        err.statusCode = 404
        return next(err)
    }

    let cart = await Cart.findOne({user: req.user.id})
    if(!cart){
        cart = await Cart.create({
            user: req.user.id,
            items: [],
            totalprice: 0
        })
    }

    const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
    )


    if(itemIndex > -1){
        cart.items[itemIndex].quantity += quantity || 1
    }else{
        cart.items.push({
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity || 1

        })
    }

    cart.totalprice = cart.items.reduce((total, item) => {
        return total + (item.price * item.quantity)
    }, 0)


    await cart.save()
    res.status(200).json({
        success: true,
        message: 'เพิ่มสินค้าในตะกร้าแล้ว',
        data: cart

    })

})


// ─── UPDATE ITEM — แก้ไขจำนวนสินค้า ──────────────    เพิ่ม item เข้า array
const updateCartItem = asyncHandler(async(req, res, next) => {
    const { quantity } = req.body
    const { productId } = req.params

    const cart = await Cart.findOne({user: req.user.id})
    if(!cart){
        const err = new Error('ไม่พบกะต้รานี้')
        err.statusCode = 404
        return next(err)
    }

    const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
    )

    if(itemIndex === -1){
        const err = new Error('ไม่พบสีนค้านี้ในกะตร้า')
        err.statusCode = 404
        return next(err)
    }

    cart.items[itemIndex].quantity = quantity


    cart.totalPrice = cart.items.reduce((total, item) => {
        return total + (item.price * item.quantity)
    }, 0)

    await cart.save()
    res.status(200).json({
        success: true,
        message: 'แก้ไขจำนวนสำเร็จ',
        data: cart
    })
})


// ─── REMOVE ITEM — ลบสินค้าออกจากตะกร้า ──────────   แก้ quantity ใน array
const removeCart = asyncHandler(async(req, res, next) => {
    const {productId} = req.params

    const cart = await Cart.findOne({user: req.user.id})
    if(!cart){
        const err = new Error('ไม่พบตะกร้า')
        err.statusCode = 404
        return next(err)
    }

    cart.items = cart.items.filter(
        item => item.product.toString() !== productId
    )

    cart.totalPrice = cart.items.reduce((total, item) => {
        return total + (item.price * item.quantity)
    }, 0)
z

    await cart.save()

    res.status(200).json({
        success: true,
        message: 'ลบสินค้าออกจากตะกร้าแล้ว',
        data: cart
    })

})

//ล้าง array ให้ว่าง
const clearCart = asyncHandler(async(req, res, next) => {

    const cart = await Cart.findOne({user: req.user.id})
    if(!cart){
        const err = new Error('ไม่พบตะกร้า')
        err.statusCode = 404
        return next(err)
    }

    cart.items = []
    cart.totalPrice = 0
    await cart.save()
    
    res.status(200).json({
        success: true,
        message: 'ล้างตะกล้า',
        data: cart
    })
})



module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeCart,
    clearCart
}