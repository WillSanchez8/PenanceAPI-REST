/**
 * Nombre del archivo: controllerBook.js
 * Descripción: Controlador de las rutas de books
 * Desarrolladores:
 *      - Fernando Ruiz
 * Fecha de creación: 28/12/2023
 * Fecha de modificación: 23/01/2024
 */

const express = require('express');
const router = express.Router();
const connection = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const appRoot = require('app-root-path');
const { error } = require('console');

// Configuring multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const rootPath = appRoot.toString();
      const destinationPath = path.join(rootPath, 'docs');
      cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
      const filename = Date.now() + path.extname(file.originalname);
      cb(null, filename);
    }
});

const upload = multer({ storage });


// Delete a file
router.delete('/delete/:idB', async (req, res) => {
    const { idB } = req.params;
    const query = 'SELECT pdf FROM books WHERE idB = ?';

    try {
        const [results] = await connection.promise().query(query, [idB]);
        if (results.length > 0) {
            const filePath = path.join(appRoot.toString(), results[0].pdf);
            try {
                fs.unlinkSync(filePath);
            } catch (error) {
                return res.status(500).json({ message: '4' }); // Error deleting file
            }
            const deleteQuery = 'DELETE FROM books WHERE idB = ?';
            await connection.promise().query(deleteQuery, [idB]);
            res.status(200).json({ message: '1' }); // Homework books
        } else {
            res.status(404).json({ message: '2' }); // books not found
        }
    } catch (error) {
        return res.status(500).json({ message: '3' }); // book not found
    }
});
/*
router.delete('/delete/:idB', (req, res) => {
    const { idB } = req.params;
    const query = 'SELECT pdf FROM books WHERE idB = ?';
  
    connection.query(query, [idB], (error, results) => {
      if (error) {
        return res.status(500).json({ message: '3' }); // book not found
      }
  
      if (results.length > 0) {
        const filePath = path.join(appRoot.toString(), results[0].pdf);
        fs.unlink(filePath, (err) => {
          if (err) {
            return res.status(500).json({ message: '4' }); // Error deleting books
          }
  
          const deleteQuery = 'DELETE FROM books WHERE idB = ?';
          connection.query(deleteQuery, [idB], (error, results) => {
            if (error) {
              return res.status(500).send({ message: '0' }); // Error deleting books
            }
            res.status(200).json({ message: '1' }); // Homework books
          });
        });
      } else {
        res.status(404).json({ message: '2' }); // books not found
      }
    });
  }
);
*/

// download a file pdf
router.get('/download/:idB', async (req, res) => {
    const { idB} = req.params;
    const query = 'SELECT pdf FROM books WHERE idB = ?';

    try {
        const [results] = await connection.promise().query(query, [idB]);
        if (results.length > 0) {
            const filePath = path.join(appRoot.toString(), results[0].pdf);
            res.download(filePath);
        } else {
            res.status(404).send({ message: '2' }); // books not found
        }
    } catch (error) {
        return res.status(500).json({ message: '0' }); // Error downloading books
    }
});
/*
router.get('/download/:idB', (req, res) => {
    const { idB} = req.params;
    const query = 'SELECT pdf FROM books WHERE idB = ?';
  
    connection.query(query, [idB], (error, results) => {
      if (error) {
        return res.status(500).json({ message: '0' }); // Error downloading books
      }
  
      if (results.length > 0) {
        const filePath = path.join(appRoot.toString(), results[0].pdf);
        res.download(filePath);
      } else {
        res.status(404).send({ message: '2' }); // books not found
      }
    });
  }
);
*/

// Get a books by ID
router.get('/getBook/:idB', async (req, res) => {
    const { idB } = req.params;
    const query = 'SELECT * FROM books WHERE idB = ?';

    try {
        const [results] = await connection.promise().query(query, [idB]);
        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).json({ message: '2' }); // books not found
        }
    } catch (error) {
        return res.status(500).json({ message: '0' }); // Error retrieving books
    }
});
/*
router.get('/getBook/:idB', (req, res) => {
    const { idB } = req.params;
    const query = 'SELECT * FROM books WHERE idB = ?';
  
    connection.query(query, [idB], (error, results) => {
      if (error) {
        return res.status(500).json({ message: '0' }); // Error retrieving books
      }
  
      if (results.length > 0) {
        res.status(200).json(results[0]);
      } else {
        res.status(404).json({ message: '2' }); // books not found
      }
    });
  }
);
*/

// Get all books
router.get('/getBooks', async (req, res) => {
    const query = 'SELECT * FROM books';

    try {
        const [results] = await connection.promise().query(query);
        res.status(200).json(results);
    } catch (error) {
        return res.status(500).json({ message: '0' }); // Error retrieving books
    }
});
/*
router.get('/getBooks', (req, res) => {
    const query = 'SELECT * FROM books';
  
    connection.query(query, (error, results) => {
      if (error) {
        return res.status(500).json({ message: '0' }); // Error retrieving books
      }
      res.status(200).json(results);
    });
  }
);
*/

// Upload a file
router.post('/upload', upload.single('pdf'), async (req, res) => {
    const { title, author, publication_date, noEmployee } = req.body;
    const pdf = path.relative(appRoot.toString(), req.file.path);

    try {
        const [results] = await connection.promise().query('SELECT MAX(idB) AS maxId FROM books');
        const idB = results[0].maxId + 1;
        if (!title || !author || !noEmployee) {
            res.status(400).json({ message: '2' }); // One or more fields are empty
        } else {
            const query = 'INSERT INTO books (idB, title, author, publication_date, pdf, noEmployee) VALUES (?, ?, ?, ?, ?, ?)';
            await connection.promise().query(query, [idB, title, author, publication_date, pdf, noEmployee]);
            res.status(201).json({ message: '1' }); // books created
        }
    } catch (error) {
        return res.status(500).json({ message: '0' }); // Error creating books
    }
});
/*
router.post('/upload', upload.single('pdf'), (req, res) => {
    const { title, author, publication_date, noEmployee } = req.body;
    const pdf = path.relative(appRoot.toString(), req.file.path);
  
    // Obtén el ID más grande
    connection.query('SELECT MAX(idB) AS maxId FROM books', (error, results) => {
      if (error) {
        return res.status(400).json({ message: '0' }); // Error creating books
      }
      // Incrementa el ID más grande en uno
      const idB = results[0].maxId + 1;
      // Verify if title or description are empty
      if (!title || !author || !noEmployee) {
        res.status(400).json({ message: '2' }); // One or more fields are empty
      } else {
        const query = 'INSERT INTO books (idB, title, author, publication_date, pdf, noEmployee) VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(query, [idB, title, author, publication_date, pdf, noEmployee], (error, results) => {
          if (error) {
            return res.status(500).json({ message: '0' }); // Error creating books
          }
          res.status(201).json({ message: '1' }); // books created
        });
      }
    });
  }
);
*/


module.exports = router;