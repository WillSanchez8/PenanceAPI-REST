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
        cb(null, path.resolve(__dirname, '../docs'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });


// Delete a file
router.delete('/delete/:idB', (req, res) => {
    const { idB } = req.params;
    const query = 'SELECT pdf FROM books WHERE idB = ?';
  
    connection.query(query, [idB], (error, results) => {
      if (error) {
        return res.status(500).json({ message: '0' }); // Error deleting books
      }
  
      if (results.length > 0) {
        fs.unlink(results[0].pdf, (err) => {
          if (err) {
            return res.status(500).json({ message: '0' }); // Error deleting books
          }
  
          const deleteQuery = 'DELETE FROM books WHERE idHB = ?';
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

// download a file pdf
router.get('/download/:idB', (req, res) => {
    const { idB} = req.params;
    const query = 'SELECT pdf FROM books WHERE idB = ?';
  
    connection.query(query, [idB], (error, results) => {
      if (error) {
        return res.status(500).json({ message: '0' }); // Error downloading books
      }
  
      if (results.length > 0) {
        res.download(path.resolve(__dirname, results[0].pdf));
      } else {
        res.status(404).send({ message: '2' }); // books not found
      }
    });
  }
);

// Get a books by ID
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

// Get all books
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

// Upload a file
router.post('/upload', upload.single('pdf'), (req, res) => {
    const { title, author, publication_date, noEmployee } = req.body;
    const pdf = req.file.path;
  
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


module.exports = router;