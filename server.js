require('dotenv').config();

const http = require('http');
const port = process.env.PORT || 3353;
const api = require('./src/api');
const server = http.createServer(api);

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});