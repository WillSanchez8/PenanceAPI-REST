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
  
  const uploadTask = multer({ storage });

  router.post('/upload', uploadTask.single('pdf'), (req, res) => {
    const { title, description, publication_date, noEmployee, category} = req.body;
    const pdf = path.relative(appRoot.toString(), req.file.path);
  
    // Obtén el ID más grande
    connection.query('SELECT MAX(idH) AS maxId FROM homework', (error, results) => {
      if (error) {
        return res.status(400).json({ message: '0' }); // Error creating homework
      }
      // Incrementa el ID más grande en uno
      const idH = results[0].maxId + 1;
      // Verify if title or description are empty
      if (!title || !description || !category || !noEmployee) {
        res.status(400).json({ message: '2' }); // One or more fields are empty
      } else {
        const query = 'INSERT INTO homework (idH, title, description, publication_date, pdf, noEmployee, category) VALUES (?, ?, ?, ?, ?, ?, ?)';
        connection.query(query, [idH, title, description, publication_date, pdf, noEmployee, category], (error, results) => {
          if (error) {
            return res.status(500).json({ message: '0' }); // Error creating homework
          }
          res.status(201).json({ message: '1' }); // Homework created
        });
      }
    });
  }
);

module.exports = router;
