const express = require('express')
const router = express.Router()

const{getCart, addToCart, updateCartItem, removeCart, clearCart} = require('../controller/cartController')
const {protect, authorize} = require('../middleware/auth')


router.get('/', protect, getCart)
router.post('/', protect, addToCart)
router.put('/:productId', protect, updateCartItem)
router.delete('/:productId', protect, removeCart)
router.delete('/', protect, clearCart)


module.exports = router