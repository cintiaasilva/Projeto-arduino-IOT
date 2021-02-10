'use strict';

// configurações gerais, mexer com cautela
var express = require('express');
var router = express.Router();
//var isNull = require('../script').isNull;
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
    Database.query(`SELECT TOP ${limite_linhas} momento, temperatura, umidade FROM Leitura order by hora desc`).then(resultados => {
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

// separa as ultimas temperaTURAS LIDAS
router.get('/ultimasTemp', (req, res, next) => {

    var limite_linhas = 10;
    var resposta = {};
    Database.query(`SELECT TOP ${limite_linhas} momento as momento, temperatura as temp FROM Leitura order by momento desc`).then(resultados => {
        resultados = resultados.recordsets[0];
        
        //var linhasTemp = [];
        //var linhasHora = [];
        var registroTemp = [];
        var registroHora = [];

        for (var i = 0; i < resultados.length; i++) {
            var row = resultados[i];
            var momento = moment(row.momento).format('HH-mm-ss').split('-');
            momento = `${momento[0]}:${momento[1]}:${momento[2]}`;
            /*var registro = {
                momento: momento,
                temp: row.temp
            };*/
            registroTemp[i] = row.temp;
            registroHora[i] = momento;
            console.log(resultados[i].temp);
            console.log(row.temp);
            console.log(registroTemp);
            
            console.log(momento);

        }

        //linhasTemp.push(registroTemp);
        //linhasHora.push(registroHora);
        resposta.temp = registroTemp;
        resposta.hora = registroHora;
        
        console.log(momento);
        console.log(registroTemp);
        res.json(resposta);
    }).catch(error => {
        console.log(error);
        res.status(400).json({"error": `erro na consulta junto ao banco de dados ${error}`});
    });

});

// separa as ultimas umidades lidas
router.get('/ultimasUmi', (req, res, next) => {

    var limite_linhas = 10;
    var resposta = {};
    Database.query(`SELECT TOP ${limite_linhas} momento as momento, umidade as umi FROM Leitura order by momento desc`).then(resultados => {
        resultados = resultados.recordsets[0];
        
        //var linhasTemp = [];
        //var linhasHora = [];
        var registroUmi = [];
        var registroHora = [];

        for (var i = 0; i < resultados.length; i++) {
            var row = resultados[i];
            var momento = moment(row.momento).format('HH-mm-ss').split('-');
            momento = `${momento[0]}:${momento[1]}:${momento[2]}`;
            /*var registro = {
                momento: momento,
                temp: row.temp
            };*/
            registroUmi[i] = row.umi;
            registroHora[i] = momento;
            console.log(resultados[i].umi);
            console.log(row.umi);
            console.log(registroUmi);
            
            console.log(momento);

        }

        //linhasTemp.push(registroTemp);
        //linhasHora.push(registroHora);
        resposta.umi = registroUmi;
        resposta.hora = registroHora;
        
        console.log(momento);
        console.log(registroUmi);
        res.json(resposta);
    }).catch(error => {
        console.log(error);
        res.status(400).json({"error": `erro na consulta junto ao banco de dados ${error}`});
    });

});

// consulta que retorna as médias de temperatura e umidade
router.get('/medias', (req, res, next) => {

    Database.query(`SELECT avg(temperatura) as media_temp, avg(umidade) as media_umid FROM Leitura`).then(resultados => {
        var linha = resultados.recordsets[0][0];
        var temperatura = linha.media_temp.toFixed(2);
        var umidade = linha.media_umid.toFixed(2);
        res.json({temperatura:temperatura, umidade:umidade});
    }).catch(error => {
        console.log(error);
        res.status(400).json({"error": `erro na consulta junto ao banco de dados ${error}`});
    });

});

// consulta que retorna as maximas de temperatura e umidade
router.get('/maximas', (req, res, next) => {

    Database.query(`SELECT MAX(temperatura) as maxTemp, MAX(umidade) as maxUmi  FROM Leitura`).then(resultados => {
        var linha = resultados.recordsets[0][0];
        var temperatura = linha.maxTemp.toFixed(2);
        var umidade = linha.maxUmi.toFixed(2);
     
        res.json({temperatura:temperatura, umidade:umidade});
    }).catch(error => {
        console.log(error);
        res.status(400).json({"error": `erro na consulta junto ao banco de dados ${error}`});
    });

});
// consulta que retorna as minimas de temperatura e umidade
router.get('/minimas', (req, res, next) => {

    Database.query(`SELECT MIN(temperatura) as minTemp, MIN(umidade) as minUmi  FROM Leitura`).then(resultados => {
        var linha = resultados.recordsets[0][0];
        var temperatura = linha.minTemp.toFixed(2);
        var umidade = linha.minUmi.toFixed(2);
     
        res.json({temperatura:temperatura, umidade:umidade});
    }).catch(error => {
        console.log(error);
        res.status(400).json({"error": `erro na consulta junto ao banco de dados ${error}`});
    });

});

// consulta que retorna as medianas de temperatura 
router.get('/medianaTemp', (req, res, next) => {

    Database.query(`SELECT DISTINCT PERCENTILE_CONT(0.50) WITHIN GROUP(ORDER BY temperatura) 
    OVER (PARTITION BY 1) as medianatemp FROM Leitura;`).then(resultados => {
        var linha = resultados.recordsets[0][0];
        var temperatura = linha.medianatemp.toFixed(2);

     
        res.json({temperatura:temperatura});
    }).catch(error => {
        console.log(error);
        res.status(400).json({"error": `erro na consulta junto ao banco de dados ${error}`});
    });

});

// consulta que retorna as medianas de  umidade
router.get('/medianaUmi', (req, res, next) => {

    Database.query(`SELECT DISTINCT PERCENTILE_CONT(0.50) WITHIN GROUP(ORDER BY umidade)
    OVER (PARTITION BY 1) as medianaumi FROM Leitura`).then(resultados => {
        var linha = resultados.recordsets[0][0];
        var umidade = linha.medianaumi.toFixed(2);

     
        res.json({umidade:umidade});
    }).catch(error => {
        console.log(error);
        res.status(400).json({"error": `erro na consulta junto ao banco de dados ${error}`});
    });

});

// retorna o 1 quartil da temperatura
router.get('/quartil1Temp', (req, res, next) => {

    Database.query(`SELECT DISTINCT PERCENTILE_CONT(0.25) WITHIN GROUP(ORDER BY temperatura) 
    OVER (PARTITION BY 1) as quaTemp FROM Leitura`).then(resultados => {
        var linha = resultados.recordsets[0][0];
        var temperatura = linha.quaTemp.toFixed(2);

     
        res.json({temperatura:temperatura});
    }).catch(error => {
        console.log(error);
        res.status(400).json({"error": `erro na consulta junto ao banco de dados ${error}`});
    });

});

// retorna o 1 quartil da umidade
router.get('/quartil1Umi', (req, res, next) => {

    Database.query(`SELECT DISTINCT PERCENTILE_CONT(0.25) WITHIN GROUP(ORDER BY umidade) 
    OVER (PARTITION BY 1) as quaUmi FROM Leitura`).then(resultados => {
        var linha = resultados.recordsets[0][0];
        var umidade = linha.quaUmi.toFixed(2);

     
        res.json({umidade:umidade});
    }).catch(error => {
        console.log(error);
        res.status(400).json({"error": `erro na consulta junto ao banco de dados ${error}`});
    });

});

// retorna o 3 quartil da umidade
router.get('/quartil3Umi', (req, res, next) => {

    Database.query(`SELECT DISTINCT PERCENTILE_CONT(0.75) WITHIN GROUP(ORDER BY umidade ) 
    OVER (PARTITION BY 1) as qua3u FROM Leitura`).then(resultados => {
        var linha = resultados.recordsets[0][0];
        var umidade = linha.qua3u.toFixed(2);

     
        res.json({umidade:umidade});
    }).catch(error => {
        console.log(error);
        res.status(400).json({"error": `erro na consulta junto ao banco de dados ${error}`});
    });

});

// retorna o 3 quartil da temperatura
router.get('/quartil3Temp', (req, res, next) => {

    Database.query(`SELECT DISTINCT PERCENTILE_CONT(0.75) WITHIN GROUP(ORDER BY temperatura) 
    OVER (PARTITION BY 1) as qua3t FROM Leitura`).then(resultados => {
        var linha = resultados.recordsets[0][0];
        var temperatura = linha.qua3t.toFixed(2);

     
        res.json({temperatura:temperatura});
    }).catch(error => {
        console.log(error);
        res.status(400).json({"error": `erro na consulta junto ao banco de dados ${error}`});
    });

});


module.exports = router;
