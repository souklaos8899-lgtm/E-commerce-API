require('dotenv').config()

const express = require('express')
const cors = require('cors')
const path = require('path')
const ConnectDB = require('./src/config/db')
const errorHandler = require('./src/middleware/errorHandler')
const authRouter = require('./src/routes/authRoutes')
const cartRouter = require('./src/routes/cartRoutes')
const productRouter = require('./src/routes/ProductRoutes')
const orderRouter = require('./src/routes/orderRoutes')
const limiter = require('./src/middleware/ratelimit')


ConnectDB()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api', limiter)


app.use('/uploads', express.static(path.join(__dirname, 'uploads')))




app.use('/api/auth', authRouter)
app.use('/api/products', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/orders', orderRouter)



app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server ทำงานปกติ' })
})


app.use((req, res, next) => {
    const err = new Error(`ไม่พบ Routes: ${req.originalUrl}`)
    err.statusCode = 404
    return next(err) 
})


app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`✅ Server รันที่ http://localhost:${PORT}`)
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`)

})