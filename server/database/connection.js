const mongoose = require('mongoose');

const connectDB = async() => {
    try {
        const con = mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser : true,
            useUnifiedTopology : true,
            useFindAndModify : false,
            useCreateIndex : true
        })
        console.log("Mongo connected : "+(await con).connection.host)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB