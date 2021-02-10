'use strict';

// configurações gerais, mexer com cautela
var express = require('express');
var router = express.Router();
var isNull = require('../script').isNull;
var Database = require('../Database');
const Cryptr = require('cryptr');
const config = require('../config');
const cryptr = new Cryptr(config.security.key);
const moment = require('moment-timezone');
// configurações gerais, mexer com cautela


// consulta que retorna os N últimos registros de leitura
router.get('/ultimas', (req, res, next) => {

    var limite_linhas = 10;
    var resposta = {};
    Database.query(`SELECT TOP ${limite_linhas} momento, temperatura, umidade FROM leitura order by momento desc`).then(resultados => {
        resultados = resultados.recordsets[0];

        resposta.cols = [
            {id: 'momento', label: 'momento', type: 'timeofday'},
            {id: 'temperatura', label: 'temperatura', type: 'number'},
            {id: 'umidade', label: 'umidade', type: 'number'}
        ];
        
        var linhas = [];
        
        for (var i = 1; i < resultados.length; i++) {
            var row = resultados[i];
            var momento = moment(row.momento).format('HH-mm-ss').split('-');
            var registro = {
                c: [{v: momento},
                    {v: row.temperatura},
                    {v: row.umidade}
                   ]
               };
            linhas.push(registro);
        }
        resposta.rows = linhas;
        
        res.json(resposta);
    }).catch(error => {
        console.log(error);
        res.status(400).json({"error": `erro na consulta junto ao banco de dados ${error}`});
    });

});

// consulta que retorna as médias de temperatura e umidade
router.get('/medias', (req, res, next) => {

    Database.query(`SELECT avg(temperatura) as media_temp, avg(umidade) as media_umid FROM leitura`).then(resultados => {
        var linha = resultados.recordsets[0][0];
        var temperatura = linha.media_temp.toFixed(2);
        var umidade = linha.media_umid.toFixed(2);
        res.json({temperatura:temperatura, umidade:umidade});
    }).catch(error => {
        console.log(error);
        res.status(400).json({"error": `erro na consulta junto ao banco de dados ${error}`});
    });

});



module.exports = router;
