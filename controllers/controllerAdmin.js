/**
 * Nombre del archivo: controllerAdmin.js
 * Descripción: Controlador de las rutas de administradores
 * Desarrolladores:
 *      - Fernando Ruiz
 * Fecha de creación: 28/12/2023
 * Fecha de modificación: 23/01/2024
 */

const express = require('express');
const router = express.Router();
const connection = require('../db');

// Create an admin
router.post('/createAdmin', async (req, res) => {
    const { noEmployee, name, email, password } = req.body;
    if (!noEmployee || !name || !email || !password) {
        return res.status(400).json({ message: '2' });
    }
    try {
        const query = `SELECT * FROM admins WHERE noEmployee=${noEmployee}`;
        const [result] = await connection.query(query);
        if (result.length > 0) {
            return res.status(403).json({ message: '2' });
        }
        const insertQuery = `INSERT INTO admins (noEmployee, name, email, password) VALUES ('${noEmployee}', '${name}', '${email}', '${password}')`;
        await connection.query(insertQuery);
        return res.status(200).json({ message: '1' });
    } catch (err) {
        return res.status(500).json({ message: '0' });
    }
});
/*
router.post('/createAdmin', (req, res) => {
    // noEmployee is ID in table admins
    const { noEmployee, name, email, password } = req.body;
    // verify if noEmployee, name, email or password are empty
    if (!noEmployee || !name || !email || !password) {
        res.status(400).json({ message: '2' }); // One or more fields are empty
    } else {
        // verify if noEmployee is already in use
        const query = `SELECT * FROM admins WHERE noEmployee=${noEmployee}`;
        connection.query(query, (err, result) => {
            if (err) {
                res.status(500).json({ message: '0' }); // Error retrieving admins
            }
            if (result.length > 0) {
                res.status(403).json({ message: '2' }); //ID already in use'
            } else {
                const query = `INSERT INTO admins (noEmployee, name, email, password) VALUES ('${noEmployee}', '${name}', '${email}', '${password}')`;
                connection.query(query, (err, result) => {
                    if (err) {
                        res.status(500).json({ message: '0' }); // Error creating admin
                    }
                    res.status(200).json({ message: '1' }); // Admin created
                });
            }
        });
    }
});
*/

// Update an admin
router.put('/updateAdmin/:noEmployee', async (req, res) => {
    const { noEmployee } = req.params;
    const { name, email, password } = req.body;
    const query = `UPDATE admins SET name='${name}', email='${email}', password='${password}' WHERE noEmployee=${noEmployee}`;
    try {
        await connection.query(query);
        return res.status(200).json({ message: '1' });
    } catch (err) {
        return res.status(500).json({ message: '0' });
    }
});
/*
router.put('/updateAdmin/:noEmployee', (req, res) => {
    const { noEmployee } = req.params;
    const { name, email, password } = req.body;
    const query = `UPDATE admins SET name='${name}', email='${email}', password='${password}' WHERE noEmployee=${noEmployee}`;
    connection.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ message: '0' }); // Error updating admin
        }
        res.status(200).json({ message: '1' }); // Admin updated
    });
});
*/

// Delete an admin
router.put('/deleteAdmin/:noEmployee', async (req, res) => {
    const { noEmployee } = req.params;
    if (!noEmployee) {
        return res.status(400).json({ message: '2' });
    }
    const query = `UPDATE admins SET status= 0 WHERE noEmployee=${noEmployee}`;
    try {
        await connection.query(query);
        return res.status(200).json({ message: '1' });
    } catch (err) {
        return res.status(500).json({ message: '0' });
    }
});
/*
router.put('/deleteAdmin/:noEmployee', (req, res) => {
    const { noEmployee } = req.params;
    // verify if noEmployee are empty
    if (!noEmployee) {
        res.status(400).json({ message: '2' }); // One or more fields are empty
    } else {
        const query = `UPDATE admins SET status= 0 WHERE noEmployee=${noEmployee}`;
        connection.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ message: '0' }); // Error deleting admin
        }
        res.status(200).json({ message: '1' }); // Admin deleted
        });
    }
});
*/

// Get all admins
router.get('/getAdmins', async (req, res) => {
    const query = `SELECT * FROM admins`;
    try {
        const [result] = await connection.query(query);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({ message: '0' });
    }
});

// Get an admin by ID
router.get('/getAdmin/:noEmployee', async (req, res) => {
    const { noEmployee } = req.params;
    const query = `SELECT * FROM admins WHERE noEmployee=${noEmployee}`;
    try {
        const [result] = await connection.query(query);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({ message: '0' });
    }
});

// Login with noEmployee and password
router.post('/login', async (req, res) => {
    const { noEmployee, password } = req.body;
    if (!noEmployee || !password) {
        return res.status(400).json({ message: '2' });
    }
    const query = `SELECT * FROM admins WHERE noEmployee='${noEmployee}' AND password='${password}' AND status=1`;
    try {
        const [result] = await connection.query(query);
        if (result.length > 0) {
            return res.status(200).json({ message: '1' });
        } else {
            return res.status(403).json({ message: '3' });
        }
    } catch (err) {
        return res.status(500).json({ message: '0' });
    }
});
/*
router.post('/login', (req, res) => {
    const { noEmployee, password } = req.body;
    // verify if noEmployee or password are empty
    if (!noEmployee || !password) {
        res.status(400).json({ message: '2' }); // One or more fields are empty
    } else {
        const query = `SELECT * FROM admins WHERE noEmployee='${noEmployee}' AND password='${password}' AND status=1`;
        connection.query(query, (err, result) => {
            if (err) {
                res.status(500).json({ message: '0' }); // Error retrieving admin
            }
            if (result.length > 0) {
                res.status(200).json({ message: '1' }); // Login successful
            } else {
                res.status(403).json({ message: '3' }); // Wrong credentials or admin inactive
            }
        });
    }
});
*/

module.exports = router;