const fs = require('fs');
const path = require('path');

// 1. Manually read .env
const envPath = path.resolve(__dirname, '.env');
let API_KEY = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/^VITE_ORS_API_KEY=(.*)$/m);
    if (match) {
        API_KEY = match[1].trim();
    }
} catch (e) {
    console.error('Failed to read .env:', e.message);
}

const ENDPOINT = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';

console.log('Testing ORS API Key...');
console.log('Key length:', API_KEY ? API_KEY.length : 'Missing');
console.log('Key prefix:', API_KEY ? API_KEY.substring(0, 5) : 'N/A');

const coordinates = [
    [11.595, 48.13], // Munich
    [11.55, 48.091]
];

async function testRequest(useBearer) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (useBearer) {
        headers['Authorization'] = `Bearer ${API_KEY}`;
    } else {
        headers['Authorization'] = API_KEY;
    }

    console.log(`\n--- Testing with ${useBearer ? 'Bearer Token' : 'Raw Key'} ---`);
    console.log('Headers:', JSON.stringify(headers, null, 2));

    try {
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ coordinates })
        });

        console.log('Status:', response.status, response.statusText);

        const data = await response.json();

        if (!response.ok) {
            console.error('Error Body:', JSON.stringify(data, null, 2));
        } else {
            console.log('Success! Received ' + (data.features ? data.features.length : 0) + ' features.');
        }
    } catch (error) {
        console.error('Request Failed:', error.message);
    }
}

async function run() {
    if (!API_KEY) {
        console.error('No API Key found in .env');
        return;
    }

    // Test 1: As simple key (Legacy)
    await testRequest(false);

    // Test 2: As Bearer token
    await testRequest(true);
}

run();
