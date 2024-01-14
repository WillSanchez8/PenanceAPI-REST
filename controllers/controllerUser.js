const express = require('express');
const router = express.Router();
const connection = require('../db');

// Create a new user
router.post('/createUser', (req, res) => {
    // noStudent is ID in table admins
    const { noStudent, name, email, password } = req.body;
    // verify if noEmployee is already in use
    const query = `SELECT * FROM users WHERE noStudent=${noStudent}`;
    connection.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ message: '0' }); // Error creating user
        }
        if (result.length > 0) {
            res.status(400).json({ message: '2' }); // User already exists
        } else {
            const query = `INSERT INTO users (noStudent, name, email, password) VALUES ('${noStudent}', '${name}', '${email}', '${password}')`;
            connection.query(query, (err, result) => {
                if (err) {
                    res.status(500).json({ message: '0' }); // Error creating user
                }
                res.status(200).json({ message: '1' }); // User created
            });
        }
    });
});

// Update an user
router.put('/updateUser/:noStudent', (req, res) => {
    const { noStudent } = req.params;
    const { name, email, password } = req.body;
    const query = `UPDATE users SET name='${name}', email='${email}', password='${password}' WHERE noStudent=${noStudent}`;
    connection.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ message: '0' }); // Error updating user
        }
        res.status(200).json({ message: '1' }); // User updated
    });
});

// Delete an user
router.delete('/deleteUser/:noStudent', (req, res) => {
    const { noStudent } = req.params;
    const query = `DELETE FROM users WHERE noStudent=${noStudent}`;
    connection.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ message: '0' }); // Error deleting user
        }
        res.status(200).json({ message: '1' }); // User deleted
    });
});

// Get all users
router.get('/getUsers', (req, res) => {
    const query = `SELECT * FROM users`;
    connection.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ message: '0' }); // Error retrieving users
        }
        res.status(200).json(result); // Users found
    })
});

// Get an user by ID
router.get('/getUser/:noStudent', (req, res) => {
    const { noStudent } = req.params;
    const query = `SELECT * FROM users WHERE noStudent=${noStudent}`;
    connection.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ message: '0' }); // Error retrieving user
        }
        res.status(200).json(result); // User found
    })
});

// Login with noStudent and password

router.post('/login', (req, res) => {
    const { noStudent, password } = req.body;
    // verify if noStudent and password are not empty
    if (!noStudent || !password) {
        res.status(400).json({ message: '2' }); // Empty fields
    }
    const query = `SELECT * FROM users WHERE noStudent='${noStudent}' AND password='${password}'`;
    connection.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ message: '0' }); // Error retrieving user
        }
        if (result.length > 0) {
            res.status(200).json({ message: '1' }); // User found
        } else {
            res.status(500).json({ message: '2' }); // User not found
        }
    });
});



module.exports = router;