const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const URL = process.env.MONGODB_URL;
const SECRET = process.env.JWT_SECRET;
const EXPIRES = process.env.JWT_EXPIRES_IN;

async function runTest() {
    try {
        console.log('--- Config Check ---');
        console.log('DB URL:', URL ? 'Set' : 'MISSING');
        console.log('JWT SECRET:', SECRET ? 'Set' : 'MISSING');
        console.log('JWT EXPIRES:', EXPIRES ? EXPIRES : 'MISSING');

        if (!URL || !SECRET || !EXPIRES) {
            console.error('CRITICAL: Environment variables are missing!');
            process.exit(1);
        }

        console.log('\n--- DB Connection ---');
        await mongoose.connect(URL);
        console.log('Connected to MongoDB.');

        const testEmail = 'debug' + Date.now() + '@test.com';
        const testPassword = 'Password123!';

        console.log('\n--- Registration Test ---');
        const newUser = await User.create({
            name: 'Debug User',
            email: testEmail,
            password: testPassword
        });
        console.log('User created successfully:', newUser.email);

        console.log('\n--- JWT Sign Test ---');
        const token = jwt.sign({ id: newUser._id }, SECRET, { expiresIn: EXPIRES });
        console.log('Token created successfully:', token.substring(0, 20) + '...');

        console.log('\n--- Login Test ---');
        const user = await User.findOne({ email: testEmail }).select('+password');
        if (!user) throw new Error('User not found after creation!');

        const isMatch = await user.correctPassword(testPassword, user.password);
        console.log('Password match:', isMatch);

        if (!isMatch) throw new Error('Password verification failed!');

        console.log('\n--- ALL TESTS PASSED ---');
        process.exit(0);
    } catch (err) {
        console.error('\n!!! TEST FAILED !!!');
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);
        console.error('Stack Trace:', err.stack);
        process.exit(1);
    }
}

runTest();
