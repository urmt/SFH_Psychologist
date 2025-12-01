/**
 * Deploy SFH Psychologist to IPFS via Pinata
 * This deploys the static frontend files
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const FormData = require('form-data');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET = process.env.PINATA_SECRET;

if (!PINATA_API_KEY || !PINATA_SECRET) {
  console.error('❌ Error: PINATA_API_KEY and PINATA_SECRET must be set in .env');
  process.exit(1);
}

console.log('🚀 Deploying SFH Psychologist to IPFS via Pinata...\n');

// Path to static files
const publicDir = path.join(__dirname, '../../apps/simple-chat/public');

// Check if directory exists
if (!fs.existsSync(publicDir)) {
  console.error('❌ Error: Public directory not found:', publicDir);
  process.exit(1);
}

console.log('📂 Deploying from:', publicDir);
console.log('📁 Files to deploy:');

const files = fs.readdirSync(publicDir);
files.forEach(file => {
  const stats = fs.statSync(path.join(publicDir, file));
  console.log(`   - ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
});

console.log('\n⏳ Uploading to Pinata...\n');

// Create form data
const form = new FormData();

// Add files to form with proper path structure
files.forEach(file => {
  const filePath = path.join(publicDir, file);
  if (fs.statSync(filePath).isFile()) {
    form.append('file', fs.createReadStream(filePath), {
      filepath: `sfh-psychologist/${file}`,
      contentType: file.endsWith('.html') ? 'text/html' : 
                   file.endsWith('.js') ? 'application/javascript' : 
                   'application/octet-stream'
    });
  }
});

// Add metadata
const metadata = JSON.stringify({
  name: 'SFH-Psychologist-Frontend',
  keyvalues: {
    version: '1.0.0',
    app: 'sfh-psychologist',
    deployment: new Date().toISOString()
  }
});
form.append('pinataMetadata', metadata);

// Add options
const options = JSON.stringify({
  wrapWithDirectory: true
});
form.append('pinataOptions', options);

// Upload to Pinata
const req = https.request({
  method: 'POST',
  host: 'api.pinata.cloud',
  path: '/pinning/pinFileToIPFS',
  headers: {
    ...form.getHeaders(),
    'pinata_api_key': PINATA_API_KEY,
    'pinata_secret_api_key': PINATA_SECRET
  }
}, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      if (response.IpfsHash) {
        console.log('✅ Successfully deployed to IPFS!\n');
        console.log('═══════════════════════════════════════════════════');
        console.log('  📦 IPFS Hash:', response.IpfsHash);
        console.log('═══════════════════════════════════════════════════');
        console.log('\n🌐 Access your app at:');
        console.log(`   https://gateway.pinata.cloud/ipfs/${response.IpfsHash}/`);
        console.log(`   https://ipfs.io/ipfs/${response.IpfsHash}/`);
        console.log(`   https://cloudflare-ipfs.com/ipfs/${response.IpfsHash}/`);
        console.log('\n⚠️  NOTE: This is a STATIC FRONTEND ONLY');
        console.log('   The backend API is NOT deployed to IPFS.');
        console.log('   You need to deploy the backend to Vercel separately.');
        console.log('\n📌 CID saved to: deployment-info.json');
        
        // Save deployment info
        const deploymentInfo = {
          ipfsHash: response.IpfsHash,
          timestamp: new Date().toISOString(),
          gateways: [
            `https://gateway.pinata.cloud/ipfs/${response.IpfsHash}/`,
            `https://ipfs.io/ipfs/${response.IpfsHash}/`,
            `https://cloudflare-ipfs.com/ipfs/${response.IpfsHash}/`
          ]
        };
        
        fs.writeFileSync(
          path.join(__dirname, '../../deployment-info.json'),
          JSON.stringify(deploymentInfo, null, 2)
        );
        
      } else {
        console.error('❌ Upload failed:', response);
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Error parsing response:', error);
      console.error('Response:', data);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Upload error:', error);
  process.exit(1);
});

form.pipe(req);
