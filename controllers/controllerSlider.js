/**
 * Nombre del archivo: controllerSlider.js
 * Descripción: Controlador de rutas para la tabla sliders
 * Desarrolladores:
 *      - Fernando Ruiz
 * Fecha de creación: 29/12/023
 * Fecha de modificación: 23/01/2024
 */

const express = require('express');
const router = express.Router();
const connection = require('../db');

/*
    Table sliders
    CREATE TABLE sliders (
    idS INT PRIMARY KEY,
    phrase VARCHAR(255) NOT NULL,
		details VARCHAR(255),
    author VARCHAR(255),
    publication_date DATE
    );
    ALTER TABLE sliders
    ADD COLUMN noEmployee INT,
    ADD FOREIGN KEY (noEmployee) REFERENCES admins(noEmployee);
*/

// Create a new slider
router.post('/createSlider', async (req, res) => {
    const { phrase, details, author, publication_date, noEmployee } = req.body;

    try {
        const [results] = await connection.promise().query('SELECT MAX(idS) AS idS FROM sliders');
        const idS = results[0].idS + 1;
        const query = 'INSERT INTO sliders (idS, phrase, details, author, publication_date, noEmployee) VALUES (?, ?, ?, ?, ?, ?)';
        await connection.promise().query(query, [idS, phrase, details, author, publication_date, noEmployee]);
        res.status(201).json({ message: 'Slider created' });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating slider' });
    }
});
/*
router.post('/createSlider', (req, res) => {
    const { phrase, details, author, publication_date, noEmployee } = req.body;

    // get last idS
    const query = `SELECT MAX(idS) AS idS FROM sliders`;
    connection.query(query, (err, result) => {
        if (err) throw err;
        const idS = result[0].idS + 1;
        const query = `INSERT INTO sliders (idS, phrase, details, author, publication_date, noEmployee) VALUES (${idS}, '${phrase}', '${details}', '${author}', '${publication_date}', ${noEmployee})`;
        connection.query(query, (err, result) => {
            if (err) throw err;
            res.status(200).send('Slider created');
        });
    });
});

 */

// Update a slider
router.put('/updateSlider/:idS', async (req, res) => {
    const { idS } = req.params;
    const { phrase, details, author, publication_date, noEmployee } = req.body;
    const query = 'UPDATE sliders SET phrase=?, details=?, author=?, publication_date=?, noEmployee=? WHERE idS=?';

    try {
        await connection.promise().query(query, [phrase, details, author, publication_date, noEmployee, idS]);
        res.status(200).json({ message: 'Slider updated' });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating slider' });
    }
});
/*
router.put('/updateSlider/:idS', (req, res) => {
    const { idS } = req.params;
    const { phrase, details, author, publication_date, noEmployee } = req.body;
    const query = `UPDATE sliders SET phrase='${phrase}', details='${details}', author='${author}', publication_date='${publication_date}', noEmployee=${noEmployee} WHERE idS=${idS}`;
    connection.query(query, (err, result) => {
        if (err) throw err;
        res.status(200).send('Slider updated');
    });
});

 */

// Delete a slider
router.delete('/deleteSlider/:idS', async (req, res) => {
    const { idS } = req.params;
    const query = 'DELETE FROM sliders WHERE idS = ?';

    try {
        await connection.promise().query(query, [idS]);
        res.status(200).json({ message: 'Slider deleted' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting slider' });
    }
});
/*
router.delete('/deleteSlider/:idS', (req, res) => {
    const { idS } = req.params;
    const query = `DELETE FROM sliders WHERE idS=${idS}`;
    connection.query(query, (err, result) => {
        if (err) throw err;
        res.status(200).send('Slider deleted');
    });
});

 */

// Get all sliders
router.get('/getSliders', async (req, res) => {
    const query = 'SELECT * FROM sliders';

    try {
        const [results] = await connection.promise().query(query);
        res.status(200).json(results);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving sliders' });
    }
});
/*
router.get('/getSliders', (req, res) => {
    const query = `SELECT * FROM sliders`;
    connection.query(query, (err, result) => {
        if (err) {
            res.status(500).send('Error retrieving sliders');
        }
        res.send(result);
    });
});

 */

// Get a slider by ID
router.get('/getSlider/:idS', async (req, res) => {
    const { idS } = req.params;
    const query = 'SELECT * FROM sliders WHERE idS = ?';

    try {
        const [results] = await connection.promise().query(query, [idS]);
        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).json({ message: 'Slider not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving slider' });
    }
});
/*
router.get('/getSlider/:idS', (req, res) => {
    const { idS } = req.params;
    const query = `SELECT * FROM sliders WHERE idS=${idS}`;
    connection.query(query, (err, result) => {
        if (err) {
            res.status(500).send('Error retrieving slider');
        }
        res.send(result);
    });
});

 */

module.exports = router;