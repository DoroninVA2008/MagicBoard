const http = require('http');
const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  const url = req.url.split('?')[0].replace(/^\//, '');
  const key = url || 'root';
  const payload = data[key];

  if (payload !== undefined) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(payload));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'not found', keys: Object.keys(data) }));
  }
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => console.log(`mock-server: http://localhost:${PORT}`));
