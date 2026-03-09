const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('CONN_SUCCESS');
        try {
            await User.create({
                name: 'Test',
                email: 'test' + Date.now() + '@t.com',
                password: 'password123'
            });
            console.log('REG_SUCCESS');
        } catch (e) {
            console.log('REG_ERROR: ' + e.message);
        }
        process.exit(0);
    } catch (e) {
        console.log('CONN_ERROR: ' + e.message);
        process.exit(1);
    }
}
run();
