const mysql = require('../mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.cadastro = async(req, res, next) => {
    try {
        const checkEmail = await mysql.execute('SELECT * FROM usuario WHERE email = ?',
        [req.body.email]);
        if(checkEmail.length > 0) {
            return res.status(409).send({
                menssagem: `O email ${req.body.email} já está cadastrado`
            });
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.senha, salt);
        const resultado = await mysql.execute('INSERT INTO usuario (nome, email, senha) VALUES(?, ?, ?)',
        [req.body.nome, req.body.email, hash]);
        return res.status(201).send({
            menssagem: 'Usuário criado com sucesso',
            usuarioCriado: {
                id: resultado.insertId,
                nome: req.body.nome,
                email: req.body.email
            }
        });
    } catch (error) {
        return res.status(500).send({ error: error});
    }
    /*mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        
        bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
            if(errBcrypt) { return res.status(500).send({ error: errBcrypt}) }
            conn.query(
                'SELECT * FROM usuario WHERE email = ?',
                [req.body.email],
                (error, resultado) => {
                    if(error) { return res.status(500).send({ error: error}) }
                    if(resultado.length > 0) {
                        return res.status(409).send({
                            menssagem: `O email ${req.body.email} já está cadastrado`
                        })
                    }
                    conn.query(
                        'INSERT INTO usuario (nome, email, senha) VALUES(?, ?, ?)',
                        [req.body.nome, req.body.email, hash],
                        (error, resultado) => {
                            conn.release();
                            if(error) { return res.status(500).send({ error: error}) }
                            return res.status(201).send({
                                menssagem: 'Usuário criado com sucesso',
                                usuarioCriado: {
                                    id: resultado.insertId,
                                    nome: req.body.nome,
                                    email: req.body.email
                                }
                            })
                        }
                    )
                }
            )
        });
    });*/
};

exports.login = async(req, res, next) => {
    try {
       const usuario = await mysql.execute('SELECT * FROM usuario WHERE email = ?',
       [req.body.email]);
       if(usuario.length < 1) {
            return res.status(401).send({
                menssagem: `O email inválido`
            });
        }
        const login = bcrypt.compareSync(req.body.senha, usuario[0].senha);
        if(!login) {
            return res.status(401).send({
                menssagem: 'senha incorreta'
            })
        }
        const token = jwt.sign({
            id_usuario: usuario[0].id_usuario,
            nome: usuario[0].nome,
            email: usuario[0].email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        });
        return res.status(200).send({
            menssagem: 'Autenticado com sucesso',
            token: token
        });
    } catch (error) {
        return res.status(500).send({ error: error});
    }
    /*mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'SELECT * FROM usuario WHERE email = ?',
            [req.body.email],
            (error, resultado) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error}) }
                if(resultado.length < 1) {
                    return res.status(401).send({
                        menssagem: `O email não existe`
                    })
                }
                bcrypt.compare(req.body.senha, resultado[0].senha, (erro, saida) => {
                    if(erro) { return res.status(500).send({ error: erro}) }
                    if(!saida) {
                        return res.status(401).send({
                            menssagem: 'senha incorreta'
                        })
                    }
                    const token = jwt.sign({
                        id_usuario: resultado[0].id_usuario,
                        nome: resultado[0].nome,
                        email: resultado[0].email
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '1h'
                    })
                    return res.status(200).send({
                        menssagem: 'Autenticado com sucesso',
                        token: token
                    })
                })
            }
        )
    });*/
}