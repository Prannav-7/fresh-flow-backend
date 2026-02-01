const http = require('http');

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/sync-review-counts',
    method: 'POST',
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('Sync result:', data);
    });
});

req.on('error', (error) => {
    console.error('Error syncing reviews:', error.message);
});

req.end();
