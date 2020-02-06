const mysql = require('../mysql').pool;

exports.todosProdutos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'SELECT * FROM produto;',
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error})}
                const resposta = {
                    registros: resultado.length,
                    produtos: resultado.map(prod => {
                        return {
                            id: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            request: {
                                tipo: 'GET',
                                descricao: '',
                                url: 'http://localhost:3353/produtos/' + prod.id_produto
                            }
                        }
                    })
                }
                return res.status(200).send(resposta);
            }
        )
    });

}

exports.insereProduto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'INSERT INTO produto (nome, preco) VALUES(?, ?)',
            [req.body.nome, req.body.preco],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error})}
                const resposta = {
                    menssagem: 'produto inserido',
                    produto: {
                        id: resultado.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'POST',
                            descricao: '',
                            url: 'http://localhost:3353/produtos/'
                        }
                    }
                }
               return res.status(201).send(resposta);
            }
        )
    })
    
}

exports.produtoUnico = (req, res, next) => {
    id = req.params.cod;
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'SELECT * FROM produto WHERE id_produto = ?;',
            [id],
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error})}

                if(resultado.length == 0) {
                    return res.status(404).send({
                        menssagem: 'produto não encontrado'
                    })
                }
                const resposta = {
                    registros: resultado.length,
                    produto: {
                        id: resultado[0].id_produto,
                        nome: resultado[0].nome,
                        preco: resultado[0].preco,
                        request: {
                            tipo: 'GET',
                            descricao: '',
                            url: 'http://localhost:3353/produtos/'
                        }
                    }    
                }
                return res.status(200).send(resposta);
            }
        )  
    });   
}

exports.alteraProduto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            `UPDATE produto 
            SET nome = ?,
            preco = ?
            WHERE id_produto = ? `,
            [
                req.body.nome,
                req.body.preco,
                req.body.id
            ],
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error})}
                const resposta = {
                    menssagem: 'o produto foi atualizado',
                    produtos: {
                        id: req.body.id,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'PATCH',
                            descricao: '',
                            url: 'http://localhost:3353/produtos/' + req.body.id
                        }
                    }
                }
                return res.status(202).send(resposta);
            }
        )
    });
}

exports.excluiProduto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'DELETE FROM produto WHERE id_produto = ?',
            [req.body.id],
            (error, resultado, fields) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error})}
                return res.status(202).send({
                    menssagem: 'o produto foi removido'
                });
            }
        )
    });
}