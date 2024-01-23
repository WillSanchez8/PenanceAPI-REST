/**
 * Nombre del archivo: db.js
 * Descripción: Archivo de conexión a la base de datos
 * Desarrolladores:
 *      - Fernando Ruiz
 * Fecha de creación: 28/12/2023
 * Fecha de modificación: 23/01/2024
 */

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'prueba'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log('Connected!');
});

module.exports = connection;