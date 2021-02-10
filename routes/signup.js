const express = require('express');
const router = express.Router();
const isNull = require('../script').isNull;
const Database = require('../Database');
const Cryptr = require('cryptr');
const config = require('../config');
const cryptr = new Cryptr(config.security.key);


router.get('/', (req, res, next) => {
    res.render('signup', {
        message: ''
    });
});

router.post('/', (req, res, next) => {
    let name = req.body.name;
    let username = req.body.username;
    let password = req.body.password;

    if (isNull(name) || isNull(username) || isNull(password)) {
        res.status(400).json({'error': 'Invalid name, username and/or password!'});
    }
    
    password = cryptr.encrypt(password);
    
    //console.log(`name: ${name}, username: ${username}, password: ${password}`);

    createUser(name, username, password, (error, results, rows) => {
        if (error) {
            res.render('signup', {"message": error, "error": "Error creating user."});
        } else {
            req.session.message = `User ${username} created succesfully! Please log in...`;
            res.status(302).redirect('/login');
        }
    });

});

function createUser(name, username, password, callback) {
    let create = undefined;
    let check = checkUser(username);
    check.then((resolve) => {
        create = !resolve;
        console.log('create:', create);
        if (create) {
            let querystring = `INSERT INTO User (nome, user, senha) VALUES ('${name}', '${username}', '${password}');`;
            Database.query(querystring, callback);
        } else {
            callback("User already exists!");
        }
    }).catch((err) => {
        console.log('Promise err');
    });
}

 function checkUser(username) {
    let querystring = `SELECT * FROM User WHERE user = '${username}'`;
    let p = new Promise((resolve, reject) => {
        Database.query(querystring, (error, results, rows) => {
        if (error) {
            console.log(error);
            reject(error);
        } else {
                let exists = results.length > 0;
                resolve(exists);
            }
        });
    });
    return p;
}

module.exports = router;