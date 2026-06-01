const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product'
                },
                name: String,
                price: Number,
                quantity: Number,
                image: String
            }
        ],
        shippingAddress: {
            street: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true,
            },

            phone: {
                type: String,
                required: true
            }
        },
        
        totalPrice: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending'
        },

        paidAt: Date
    },
    {
        timestamps: true
    }
)

module.exports =   mongoose.model('Order', OrderSchema)