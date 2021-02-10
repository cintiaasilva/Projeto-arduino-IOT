const express = require('express');
const router = express.Router();
const isNull = require('../script').isNull;
const Database = require('../Database');
const Cryptr = require('cryptr');
const config = require('../config');
const cryptr = new Cryptr(config.security.key);

router.post('/', (req, res, next) => {
	
	// após o body, são os nomes dos campos no formulário	
    let nome = req.body.nome;
    let login = req.body.email;
    let senha = req.body.senha;

    if (isNull(nome) || isNull(login) || isNull(senha)) {
        res.status(400).json({'mensagem': 'Nome, email e senha são obrigatórios'});
    }

	// tirar comentário caso desejar criptografar a senha
    //password = cryptr.encrypt(password);

    console.log(`name: ${nome}, username: ${login}, password: ${senha}`);

    criarUsuario(nome, login, senha).then(results => {
        req.session.message = `Usuário ${login} criado com sucesso`;
        res.status(200).json({'mensagem':req.session.message});
    }).catch(erro => {
		console.error(`Erro: ${erro}`);
        res.status(400).json({'mensagem':`Erro ao cadastrar: ${erro}`});
    });

});

function criarUsuario(nome, login, senha) {
    return new Promise((resolve, reject) => {
        let create = undefined;
        verificarLogin(login).then(exists => {
            create = !exists;
            console.log('create:', create);
            if (create) {
                let querystring = `INSERT INTO Usuario (nome, email, senha) VALUES ('${nome}', '${login}', '${senha}');`;
                Database.query(querystring).then(results => {
                    resolve(results);
                }).catch(error => {
                    console.error(error);
                    reject(error);
                });
            } else {
                reject(`Usuário ${login} já cadastrado!`);
            }
        }).catch((erro) => {
            reject(erro);
        });
    });
}

 function verificarLogin(login) {
    let querystring = `SELECT * FROM usuario WHERE email = '${login}'`;
    return new Promise((resolve, reject) => {
        Database.query(querystring).then(results => {
                let existe = results.recordsets[0].length > 0;
                resolve(existe);
            }).catch(error => {
                reject(error);
            });
        });
}

module.exports = router;