const mongoose = require('mongoose');

const uri = "mongodb+srv://anatherium:<db_password>@cluster0.wpsem.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
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