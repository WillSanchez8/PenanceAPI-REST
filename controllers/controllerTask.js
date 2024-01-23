/**
 * Nombre del archivo: controllerTask.js
 * Descripción: Controlador de tareas para la aplicación
 * Desarrolladores:
 *      - Laura Ramirez
 *      - Nahum Hernandez
 *      - William Aguilar
 * Fecha de creación: 15/01/2024
 * Fecha de modificación: 23/03/2024
 */

const express = require('express');
const router = express.Router();
const connection = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const appRoot = require('app-root-path');
const {error} = require('console');


// Configuring multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const rootPath = appRoot.toString();
        const destinationPath = path.join(rootPath, 'docs');
        cb(null, destinationPath);
    }, filename: function (req, file, cb) {
        const filename = Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
});

const uploadTask = multer({storage});

// Create a new task
router.post('/create', uploadTask.single('url'), async (req, res) => {
    const {noStudent, idH, status} = req.body;
    let url = null;

    // Verifica si los campos no están vacíos
    if (!noStudent && !idH) {
        res.status(400).json({message: '2'}); // One or more fields are empty
    } else {
        // Verifica si el archivo fue cargado
        if (req.file) {
            url = path.relative(appRoot.toString(), req.file.path);
        }

        const query = url ? 'INSERT INTO users_work (noStudent, idH, status, url) VALUES (?, ?, 1, ?)' : 'INSERT INTO users_work (noStudent, idH, status) VALUES (?, ?, 1)';

        try {
            await connection.promise().query(query, [noStudent, idH, url]);
            res.status(201).json({message: '1'}); // task created
        } catch (error) {
            return res.status(500).json({message: '0'}); // Error creating task
        }
    }
});
/*
router.post('/create', uploadTask.single('url'), (req, res) => {
    const {noStudent, idH, status} = req.body;
    let url = null;

    // Verifica si los campos no están vacíos
    if (!noStudent && !idH) {
        res.status(400).json({message: '2'}); // One or more fields are empty
    } else {
        // Verifica si el archivo fue cargado
        if (req.file) {
            url = path.relative(appRoot.toString(), req.file.path);
        }

        const query = url ? 'INSERT INTO users_work (noStudent, idH, status, url) VALUES (?, ?, 1, ?)' : 'INSERT INTO users_work (noStudent, idH, status) VALUES (?, ?, 1)';

        connection.query(query, [noStudent, idH, url], (error, results) => {
            if (error) {
                return res.status(500).json({message: '0'}); // Error creating task
            }
            res.status(201).json({message: '1'}); // task created
        });
    }
});

 */


//Get task by id
router.get('/getTask/:idH/:noStudent', async (req, res) => {
    const {idH, noStudent} = req.params;
    const query = 'SELECT url FROM users_work WHERE noStudent = ? AND idH = ?';

    try {
        const [results] = await connection.promise().query(query, [noStudent, idH]);
        if (results.length > 0 && results[0] && results[0].url) {
            const taskUrl = results[0].url;
            res.status(200).json({message: '1', taskUrl}); // Task found
        } else {
            res.status(404).json({message: '2'}); // Task not found
        }
    } catch (error) {
        return res.status(500).json({message: '0'}); // Error getting task
    }
});
/*
router.get('/getTask/:idH/:noStudent', (req, res) => {
    const {idH, noStudent} = req.params;
    const query = 'SELECT url FROM users_work WHERE noStudent = ? AND idH = ?';

    connection.query(query, [noStudent, idH], (error, results) => {
        if (error) {
            return res.status(500).json({message: '0'}); // Error getting task
        }

        if (results.length > 0 && results[0] && results[0].url) {
            const taskUrl = results[0].url;
            res.status(200).json({message: '1', taskUrl}); // Task found
        } else {
            res.status(404).json({message: '2'}); // Task not found
        }
    });
});

 */

//Update status task to 0
router.put('/status', async (req, res) => {
    const {noStudent, idH} = req.body;
    const updateQuery = 'UPDATE users_work SET status = 0 WHERE noStudent = ? AND idH = ?';

    try {
        await connection.promise().query(updateQuery, [noStudent, idH]);
        res.status(200).json({message: '1'});
    } catch (error) {
        return res.status(500).json({message: '0'});
    }
});
/*
router.put('/status', (req, res) => {
    const {noStudent, idH} = req.body;
    const updateQuery = 'UPDATE users_work SET status = 0 WHERE noStudent = ? AND idH = ?';

    connection.query(updateQuery, [noStudent, idH], (error, results) => {
        if (error) {
            return res.status(500).json({message: '0'});
        }
        res.status(200).json({message: '1'});
    });
});

 */


// Delete a file
router.delete('/delete/:idH/:noStudent', async (req, res) => {
    const {idH, noStudent} = req.params;
    const query = 'SELECT url FROM users_work WHERE noStudent = ? AND idH = ?';

    try {
        const [results] = await connection.promise().query(query, [noStudent, idH]);
        if (results.length > 0 && results[0] && results[0].url) {
            const filePath = path.join(appRoot.toString(), results[0].url);
            try {
                fs.unlinkSync(filePath);
            } catch (error) {
                return res.status(500).json({message: '4'}); // Error deleting file
            }
            const deleteQuery = 'DELETE FROM users_work WHERE noStudent = ? AND idH = ?';
            await connection.promise().query(deleteQuery, [noStudent, idH]);
            res.status(200).json({message: '1'}); // Homework deleted
        } else {
            res.status(404).json({message: '2'}); // Homework not found
        }
    } catch (error) {
        return res.status(500).json({message: '3'}); // Homework not found
    }
});
/*
router.delete('/delete/:idH/:noStudent', (req, res) => {
    const {idH, noStudent} = req.params;
    const query = 'SELECT url FROM users_work WHERE noStudent = ? AND idH = ?';

    connection.query(query, [noStudent, idH], (error, results) => {
        if (error) {
            return res.status(500).json({message: '3'}); // book not found
        }

        if (results.length > 0 && results[0] && results[0].url) {
            const filePath = path.join(appRoot.toString(), results[0].url);
            fs.unlink(filePath, (err) => {
                if (err) {
                    return res.status(500).json({message: '4'}); // Error deleting books
                }

                const deleteQuery = 'DELETE FROM users_work WHERE noStudent = ? AND idH = ?';
                connection.query(deleteQuery, [noStudent, idH], (error, results) => {
                    if (error) {
                        return res.status(500).json({message: '0'}); // Error deleting books
                    }
                    res.status(200).json({message: '1'}); // Homework books
                });
            });
        } else {
            console.log(results);//no hay nada
            res.status(404).json({message: '2'}); //
        }
    });
});

 */


//Elimina el registro completo de la tarea
router.delete('/deleteTaskComplete/:idH/:noStudent', async (req, res) => {
    const {idH, noStudent} = req.params;
    const query = 'DELETE FROM users_work WHERE idH = ? AND noStudent = ?';

    try {
        await connection.promise().query(query, [idH, noStudent]);
        res.status(200).json({message: '1'}); // Homework deleted
    } catch (error) {
        return res.status(500).json({message: '0'}); // Error deleting homework
    }
});
/*
router.delete('/deleteTaskComplete/:idH/:noStudent', (req, res) => {
    const {idH, noStudent} = req.params;
    const query = 'DELETE FROM users_work WHERE idH = ? AND noStudent = ?';

    connection.query(query, [idH, noStudent], (error, results) => {
        if (error) {
            return res.status(500).json({message: '0'}); // Error deleting books
        }
        res.status(200).json({message: '1'}); // Homework books
    });
});

 */


module.exports = router;
