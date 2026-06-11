const fs = require('fs');
const path = require('path');

const SERVICE_ACCOUNT_PATH = process.env.SERVICE_ACCOUNT_PATH || path.join(__dirname, 'service-account.json');
if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error('Service account JSON not found at', SERVICE_ACCOUNT_PATH);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));
const PROJECT_ID = serviceAccount.project_id;

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const crypto = require('crypto');
  
  function base64url(input) {
    return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  // Extract, pad, and rebuild PEM with proper formatting
  const lines = serviceAccount.private_key.split(/\r?\n/);
  const body = lines.slice(1, -2).join('');
  const padded = body + '='.repeat((4 - (body.length % 4)) % 4);
  const pemLines = padded.match(/.{0,64}/g);
  const cleanPem = '-----BEGIN PRIVATE KEY-----\n' + pemLines.join('\n') + '\n-----END PRIVATE KEY-----';
  
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsigned);
  const signature = signer.sign(cleanPem, 'base64');
  const jwt = `${unsigned}.${signature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')}`;

  const params = new URLSearchParams();
  params.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
  params.append('assertion', jwt);

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: params,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`failed to fetch token: ${res.status} ${txt}`);
  }
  const data = await res.json();
  return data.access_token;
}

function convertValue(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(convertValue) } };
  if (typeof v === 'object') return { mapValue: { fields: convertObject(v) } };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number') {
    if (Number.isInteger(v)) return { integerValue: String(v) };
    return { doubleValue: v };
  }
  return { stringValue: String(v) };
}

function convertObject(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === 'id') continue; // id is stored as document name
    out[k] = convertValue(v);
  }
  return out;
}

async function upsertDocument(token, collection, docId, doc) {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}/${encodeURIComponent(docId)}`;
  const body = { fields: convertObject(doc) };
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HTTP ${res.status} ${txt}`);
  }
  return await res.json();
}

async function migrate() {
  console.log('Using service account:', SERVICE_ACCOUNT_PATH);
  const token = await getAccessToken();
  console.log('Got access token. Project:', PROJECT_ID);

  const seedsDir = path.join(__dirname, 'seeds');
  if (!fs.existsSync(seedsDir)) {
    console.error('Seeds directory not found at', seedsDir);
    process.exit(1);
  }

  const files = fs.readdirSync(seedsDir).filter((f) => f.endsWith('.json'));
  for (const file of files) {
    const collection = path.basename(file, '.json');
    const arr = JSON.parse(fs.readFileSync(path.join(seedsDir, file), 'utf8'));
    console.log(`Migrating ${collection} — ${arr.length} items`);
    let created = 0;
    let updated = 0;
    for (const item of arr) {
      const docId = item.id || `doc-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
      try {
        await upsertDocument(token, collection, docId, item);
        updated++;
      } catch (err) {
        console.error(`Failed to write ${collection}/${docId}:`, err.message || err);
      }
    }
    console.log(`${collection} migrated: ${created} new, ${updated} updated`);
  }
}

migrate().then(() => console.log('Migration finished')).catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
