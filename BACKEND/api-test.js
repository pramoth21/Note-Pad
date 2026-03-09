const axios = require('axios');

async function test() {
    try {
        const email = 'test' + Date.now() + '@example.com';
        console.log('Sending request to /api/users/register...');
        const res = await axios.post('http://localhost:8070/api/users/register', {
            name: 'Pramoth',
            email: email,
            password: 'password123'
        });
        console.log('SUCCESS:', JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.log('FAILED');
        if (err.response) {
            console.log('Status:', err.response.status);
            console.log('Data:', JSON.stringify(err.response.data, null, 2));
        } else {
            console.log('Error Message:', err.message);
        }
    }
}
test();
