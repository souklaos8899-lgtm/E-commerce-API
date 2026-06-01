const mongoose = require('mongoose')


const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true,'กรุณากรอก']
        },

        description: {
            type: String,
        },


        price: {
            type: Number,
            required: [true, 'กรุณากรอก']
        },

        category: {
            type: String,
            required: [true, ' กรุณากรอก']
        },

        stock: {
            type: Number,
            default: 0
        },

        image: {
            type: String,
            default: 'No-image.jpg'
        },

        rattings: {
            type:Number,
            default: 0

        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,        //    บอกว่า field นี้เก็บ id ของ document อื่น
            ref: 'User',                                   //   อ้างอิงไปที่ User model
            required: true  
        },
    },
    {
        timestamps: true
    }
)


module.exports = mongoose.model('Product', ProductSchema)