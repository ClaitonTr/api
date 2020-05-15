const mysql = require('../mysql');

exports.todosProdutos = async(req, res, next) => {
    try{
        const result = await mysql.execute('SELECT * FROM produto;');
        const resposta = {
            registros: result.length,
            produtos: result.map(prod => {
                return {
                    id: prod.id_produto,
                    nome: prod.nome,
                    preco: prod.preco,
                    caminho_imagem: prod.caminho_foto,
                    request: {
                        tipo: 'GET',
                        descricao: '',
                        url: 'http://localhost:3353/produtos/' + prod.id_produto,
                    }
                }
            })
        }
        return res.status(200).send(resposta);
    }catch(error) {
        return res.status(500).send({ error: error});
    }
};

exports.insereProduto = async(req, res, next) => {
    try {
        const result = await mysql.execute('INSERT INTO produto (nome, preco, caminho_foto) VALUES(?, ?, ?);',
        [req.body.nome, req.body.preco, req.file.path]);
        const resposta = {
            menssagem: 'produto inserido',
            produto: {
                id: result.id_produto,
                nome: req.body.nome,
                preco: req.body.preco,
                caminho_imagem: req.file.path,
                request: {
                    tipo: 'POST',
                    descricao: '',
                    url: 'http://localhost:3353/produtos/'
                }
            }
        }
       return res.status(201).send(resposta);
    } catch (error) {
        return res.status(500).send({ error: error});
    }
};

exports.produtoUnico = async(req, res, next) => {
    id = req.params.cod;
    try {
        const resultado = await mysql.execute('SELECT * FROM produto WHERE id_produto = ?;',
        [id]);
        if(resultado.length == 0) {
            return res.status(404).send({
                menssagem: 'produto não encontrado'
            })
        }
        const resposta = {
            produto: {
                id: resultado[0].id_produto,
                nome: resultado[0].nome,
                preco: resultado[0].preco,
                caminho_imagem: resultado[0].caminho_foto,
                request: {
                    tipo: 'GET',
                    descricao: '',
                    url: 'http://localhost:3353/produtos/'
                }
            }    
        }
        return res.status(200).send(resposta);
    } catch (error) {
        return res.status(500).send({ error: error});
    }
};

exports.alteraProduto = async(req, res, next) => {
    try {
       await mysql.execute('UPDATE produto SET nome = ?, preco = ?, caminho_foto = ? WHERE id_produto = ?',
       [req.body.nome,
        req.body.preco,
        req.file.path,
        req.body.id]);
        const resposta = {
            menssagem: 'o produto foi atualizado',
            produtos: {
                id: req.body.id,
                nome: req.body.nome,
                preco: req.body.preco,
                caminho_imagem: req.file.path,
                request: {
                    tipo: 'PATCH',
                    descricao: '',
                    url: 'http://localhost:3353/produtos/' + req.body.id
                }
            }
        }
        return res.status(202).send(resposta);
    } catch (error) {
        return res.status(500).send({ error: error});
    }
};

exports.excluiProduto = async(req, res, next) => {
    try {
       await mysql.execute('DELETE FROM produto WHERE id_produto = ?',
       [[req.body.id]]); 
        return res.status(202).send({
            menssagem: 'o produto foi removido'
        });
    } catch (error) {
        return res.status(500).send({ error: error});
    }
};