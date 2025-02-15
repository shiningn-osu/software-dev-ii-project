const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('INSERT MONGODB DB IN HERE', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connectione error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;