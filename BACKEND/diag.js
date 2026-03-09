const axios = require('axios');

async function testConnection() {
    try {
        console.log('Testing backend root...');
        const root = await axios.get('http://localhost:8070/');
        console.log('Backend root response:', root.data);

        console.log('Testing user registration...');
        const reg = await axios.post('http://localhost:8070/api/users/register', {
            name: 'Test User',
            email: 'test' + Date.now() + '@example.com',
            password: 'Password123!'
        });
        console.log('Registration success:', reg.data.status);
    } catch (err) {
        console.error('Test failed!');
        console.error('Status:', err.response?.status);
        console.error('Data:', err.response?.data);
        console.error('Message:', err.message);
    }
}

testConnection();
