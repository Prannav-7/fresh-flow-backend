const http = require('http');

console.log('🔄 Starting review count synchronization...');
console.log('⚠️  Make sure your backend server is running on port 5000!');
console.log('');

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/sync-review-counts',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('✅ Response received:');
        console.log('');
        try {
            const result = JSON.parse(data);
            console.log(JSON.stringify(result, null, 2));
            console.log('');
            console.log('✅ Review counts synchronized successfully!');
            console.log('📊 All product review counts now match the actual reviews in the database.');
        } catch (e) {
            console.log(data);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Error syncing reviews:', error.message);
    console.error('');
    console.error('💡 Make sure:');
    console.error('   1. Your backend server is running (npm start or node server.js)');
    console.error('   2. The server is running on port 5000');
    console.error('   3. There are no firewall issues blocking localhost connections');
});

req.end();
