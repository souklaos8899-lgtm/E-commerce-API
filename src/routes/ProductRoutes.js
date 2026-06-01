const express = require('express')
const router = express.Router()


const {getProduct, getProductById, createProduct, updateProduct, deleteProduct, uploadImage} = require('../controller/productController')
const { protect, authorize} = require('../middleware/auth')
const upload = require('../middleware/upload')

router.get('/', protect, getProduct)
router.get('/:id', protect, getProductById)
router.post('/', protect, authorize('admin'), createProduct)
router.put('/:id', protect, authorize('admin'), updateProduct)
router.delete('/:id', protect, authorize('admin'), deleteProduct)
router.put('/:id/image', protect, authorize('admin'), upload.single('image'), uploadImage)

module.exports = router