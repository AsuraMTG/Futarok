const express = require('express');
const app = express();
const mysql = require('mysql2');
app.use(express.json());

require('dotenv').config();

const connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3307,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
});

connection.connect(function(err) {
    if (err) {
        console.error('Hiba a kapcsolatban: ' + err.stack);
        return;
    }
    console.log('Kapcsolódva az adatbázishoz.');
});

app.get('/futar', (req, res) => {
    let sql = 'SELECT fazon, fnev, ftel FROM futar';
    connection.query(sql, function(err, rows) {
        if (err) {
            console.error(err);
            res.status(500).send('Adatbázis hiba történt.');
            return;
        }
        res.send(rows);
    });
});

app.get('/futar/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'SELECT fazon, fnev, ftel FROM futar WHERE fazon = ?';
    let sqlParams = [id];
    connection.query(sql, sqlParams, function(err, rows) {
        if (err) {
            console.error(err);
            res.status(500).send('Adatbázis hiba történt.');
            return;
        }
        res.send(rows);
    });
});

app.post('/futar', (req, res) => {
    let uj = req.body;
    let sql = 'INSERT INTO futar (fazon, fnev, ftel) VALUES (NULL, ?, ?)';
    let sqlParams = [uj.fnev, uj.ftel];
    connection.query(sql, sqlParams, function(err, rows) {
        if (err) {
            console.error(err);
            res.status(500).send('Adatbázis hiba történt.');
            return;
        }
        let lastInsertId = rows.insertId;
        res.status(201).send(lastInsertId, rows.fnev, rows.ftel);
    });
});

app.put('/futar/:id', (req, res) => {
    let id = req.params.id;
    let uj = req.body;
    let sql = 'UPDATE futar SET fnev = ?, ftel = ? WHERE fazon = ?';
    let sqlParams = [uj.fnev, uj.ftel, id];
    connection.query(sql, sqlParams, function(err, rows) {
        if (err) {
            console.error(err);
            res.status(500).send('Adatbázis hiba történt.');
            return;
        }
        res.status(201).send(rows);
    });
});

app.delete('/futar/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM futar WHERE fazon = ?';
    let sqlParams = [id];
    connection.query(sql, sqlParams, function(err, rows) {
        if (err) {
            console.error(err);
            res.status(500).send('Adatbázis hiba történt.');
            return;
        }
        res.status(201).send(rows);
    });
});

app.listen(3000, () => {
    console.log('A szerver elindult a 3000-es porton.');
});
