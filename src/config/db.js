const mongoose = require('mongoose')

const connectDB = async() => {
    try{

        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Connect is Success ${conn.connection.host}`)
    }catch(error){
        console.error('Connect is false')
        process.exit(1)
    }
}


module.exports = connectDB