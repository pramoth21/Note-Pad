const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const URL = process.env.MONGODB_URL;

console.log('Attempting to connect to MongoDB...');
console.log('URL found:', URL ? 'Yes (hidden for security)' : 'No');

mongoose.connect(URL)
    .then(() => {
        console.log('SUCCESS: Connected to MongoDB safely.');
        process.exit(0);
    })
    .catch((err) => {
        console.error('FAILURE: Could not connect to MongoDB.');
        console.error('Error details:', err.message);
        process.exit(1);
    });

// Set a timeout in case it hangs
setTimeout(() => {
    console.error('FAILURE: Connection timed out after 10 seconds.');
    process.exit(1);
}, 10000);
