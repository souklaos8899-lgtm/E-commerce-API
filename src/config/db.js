const mongoose = require('mongoose')

const ConnectDB = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`เชื่อมต่อสำเร็จ ${conn.connection.host}`)

    }catch(error){
        console.error('เขื่อมต่อผีดพาด')
        process.exit(1)
    }
}

module.exports = ConnectDB