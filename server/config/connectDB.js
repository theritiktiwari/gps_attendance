const mongoose = require('mongoose');

// Connect to the database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database connected!');
    } catch (err) {
        console.log(err);
    }
}

module.exports = connectDB;