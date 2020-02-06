const mysql = require('../mysql').pool;

exports.todosPedidos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            `SELECT pedido.id_pedido,
                    pedido.quantidade,
                    produto.id_produto,
                    produto.nome,
                    produto.preco
             FROM pedido
             INNER JOIN produto
             ON produto.id_produto = pedido.produto;`,
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error})}
                const resposta = {
                    registros: resultado.length,
                    pedidos: resultado.map(ped => {
                        return {
                            id: ped.id_pedido,
                            quantidade: ped.quantidade,
                            produto: {
                                id: ped.id_produto,
                                nome: ped.nome,
                                preco: ped.preco
                            },
                            request: {
                                tipo: 'GET',
                                descricao: '',
                                url: 'http://localhost:3353/pedidos/' + ped.id_pedido
                            }
                        }
                    })
                }
                return res.status(200).send(resposta);
            }
        )
    });

}

exports.novoPedido = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error})}
        conn.query(
            'SELECT * FROM produto WHERE id_produto = ?',
            [req.body.produto],
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error})}

                if(resultado.length === 0) {
                    return res.status(404).send({
                        menssagem: 'Produto inválido'
                    })
                }
                conn.query(
                    'INSERT INTO pedido (produto, quantidade) VALUES(?, ?)',
                    [req.body.produto, req.body.qntde],
                    (error, resultado, field) => {
                        conn.release();
                        if (error) { return res.status(500).send({ error: error})}
                        const resposta = {
                            menssagem: 'pedido inserido',
                            pedido: {
                                id: resultado.id_pedido,
                                id_produto: req.body.produto,
                                quantidade: req.body.qntde,
                                request: {
                                    tipo: 'POST',
                                    descricao: '',
                                    url: 'http://localhost:3353/pedidos/'
                                }
                            }
                        }
                    return res.status(201).send(resposta);
                    }
                )
            }
        )
    })
    
}

exports.unicoPedido = (req, res, next) => {
    id = req.params.cod;
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'SELECT * FROM pedido WHERE id_pedido = ?;',
            [id],
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error})}

                if(resultado.length == 0) {
                    return res.status(404).send({
                        menssagem: 'pedido não encontrado'
                    })
                }
                const resposta = {
                    registros: resultado.length,
                    pedido: {
                        id: resultado[0].id_pedido,
                        id_produto: resultado[0].produto,
                        quantidade: resultado[0].quantidade,
                        request: {
                            tipo: 'GET',
                            descricao: '',
                            url: 'http://localhost:3353/pedidos/'
                        }
                    }    
                }
                return res.status(200).send(resposta);
            }
        )  
    });   
}

exports.alteraPedido = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            `UPDATE pedido 
            SET produto = ?,
            quantidade = ?
            WHERE id_pedido = ? `,
            [
                req.body.produto,
                req.body.qntde,
                req.body.id
            ],
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error})}
                const resposta = {
                    menssagem: 'o pedido foi atualizado',
                    pedido: {
                        id: req.body.id,
                        nome: req.body.produto,
                        preco: req.body.qntde,
                        request: {
                            tipo: 'PATCH',
                            descricao: '',
                            url: 'http://localhost:3353/pedidos/' + req.body.id
                        }
                    }
                }
                return res.status(202).send(resposta);
            }
        )
    });
}

exports.excluiPedido = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'DELETE FROM pedido WHERE id_pedido = ?',
            [req.body.id],
            (error, resultado, fields) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error})}
                return res.status(202).send({
                    menssagem: 'O pedido foi removido'
                });
            }
        )
    });
}