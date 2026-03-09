async function test() {
    try {
        const res = await fetch('http://localhost:8070/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Pramoth',
                email: 'test' + Date.now() + '@example.com',
                password: 'password123'
            })
        });
        const data = await res.json();
        console.log('STATUS:', res.status);
        console.log('BODY:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.log('FETCH_ERROR:', e.message);
    }
}
test();
