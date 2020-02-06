const http = require('http');
const port = process.env.PORT || 3353;
const api = require('./src/api');
const server = http.createServer(api);
console.log('servidor rodando...');
server.listen(port);