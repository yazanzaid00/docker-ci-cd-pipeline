const http = require('http');

const PORT = process.env.PORT || 3000;
const VERSION = process.env.VERSION || '1.0.0';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: 'Hello from Docker CI/CD Pipeline!',
    version: VERSION,
    timestamp: new Date().toISOString(),
    hostname: require('os').hostname()
  }, null, 2));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Version: ${VERSION}`);
});
