const express = require('express')
const router = express.Router()

const {getAllOrder, getMyorder, getOrderById, cancelOrder, createOrder, updateStatus} = require('../controller/orderController')
const {protect, authorize} = require('../middleware/auth')



router.get('/me', protect, getMyorder)
router.get('/', protect, authorize('admin'), getAllOrder)
router.get('/:id', protect, getOrderById)
router.post('/', protect, createOrder)
router.put('/:id/status', protect, authorize('admin'), updateStatus)
router.delete('/:id/cancel', protect, cancelOrder)


module.exports = router