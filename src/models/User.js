const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'กรุณากรอก'],
        },
        email: {
            type: String,
            required: [true, 'กรุณากรอก'],
            unique: true
        },

        password: {
            type: String,
            required: [true, 'กรุณากรอก'],
            select: false,
        },

        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },

        address: {
            street: String,
            city: String,
            phone: Number
        }
    },
    {
        timestamps: true
    }
)


UserSchema.pre('save', function(next ){
    const user = this

    if(!user.isModified('password')){
        return next()
    }

    bcrypt.hash(user.password, 10, function(err, hash){
        if(err) return (err)
        user.password = hash
        next()
    })
})


UserSchema.methods.matchsPassword = async function (enteredpassword) {
    return bcrypt.compare(enteredpassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)