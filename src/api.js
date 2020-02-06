const express = require('express');
const api = express();
const bodyParser = require('body-parser');

const produto = require('./rotas/produtos');
const pedido = require('./rotas/pedido');
const usuario = require('./rotas/usuario');

api.use(bodyParser.urlencoded({extended: false}));
api.use(bodyParser.json());

api.use((req, res, next) => {
    res.header('Access-Control-Allow-Orign', '*');
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Conten-Type, Accept, Authorization'
    );
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        return res.status(200).send({});
    }
    next();
})

api.use('/produtos', produto);
api.use('/pedidos', pedido);
api.use('/usuarios', usuario);

api.use((req, res, next) => {
    const erro = new Error('Caminho não encontrado');
    erro.status = 404;
    next(erro);
});

api.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.json({
        erro: {
            menssagem: error.message
        }
    });
});

module.exports = api;