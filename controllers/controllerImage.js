const express = require('express');
const router = express.Router();
const connection = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const appRoot = require('app-root-path');
const { error } = require('console');

// Configuración de Multer para imágenes
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      const rootPath = appRoot.toString();
      const destinationPath = path.join(rootPath, 'img'); // Cambiar a la carpeta donde quieres guardar las imágenes
      cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
      const filename = Date.now() + path.extname(file.originalname);
      cb(null, filename);
    }
  });

const uploadImage = multer({ storage: imageStorage });

// Ruta para subir una imagen
router.post('/uploadImage', uploadImage.single('image'), (req, res) => {
    const { title, description, publication,noEmployee } = req.body;
    const image = path.relative(appRoot.toString(), req.file.path);
  
    // Obtén el ID más grande
    connection.query('SELECT MAX(idI) AS maxId FROM imagen', (error, results) => {
      if (error) {
        console.log(error);
        return res.status(400).json({ message: '0' }); // Error creating books
      }
      // Incrementa el ID más grande en uno
      const idI = results[0].maxId + 1;
      // Verify if title or description are empty
      if (!title || !description || !noEmployee) {
        res.status(400).json({ message: '2' }); // One or more fields are empty
      } else {
        const query = 'INSERT INTO imagen (idI, title, description, publication, image, noEmployee) VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(query, [idI, title, description, publication, image, noEmployee], (error, results) => {
          if (error) {
            console.log(error);
            return res.status(500).json({ message: '0' }); // Error creating books
          }
          res.status(201).json({ message: '1' }); // books created
        });
      }
    });
});

// Get all imagen
router.get('/getImagen', (req, res) => {
    const query = 'SELECT * FROM imagen';
  
    connection.query(query, (error, results) => {
      if (error) {
        return res.status(500).json({ message: '0' }); // Error retrieving books
      }
      res.status(200).json(results);
    });
  }
);

// download an image
router.get('/download/:idI', (req, res) => {
    const { idI } = req.params;
    const query = 'SELECT image FROM imagen WHERE idI = ?';
  
    connection.query(query, [idI], (error, results) => {
      if (error) {
        return res.status(500).json({ message: '0' }); // Error downloading image
      }
  
      if (results.length > 0) {
        const filePath = path.join(appRoot.toString(), results[0].image);
        res.download(filePath);
      } else {
        res.status(404).send({ message: '2' }); // Image not found
      }
    });
});

// Delete an image
router.delete('/delete/:idI', (req, res) => {
    const { idI } = req.params;
    const query = 'SELECT image FROM imagen WHERE idI = ?';
  
    connection.query(query, [idI], (error, results) => {
      if (error) {
        return res.status(500).json({ message: '3' }); // Image not found
      }
  
      if (results.length > 0) {
        const filePath = path.join(appRoot.toString(), results[0].image);
        fs.unlink(filePath, (err) => {
          if (err) {
            return res.status(500).json({ message: '4' }); // Error deleting image
          }
  
          const deleteQuery = 'DELETE FROM imagen WHERE idI = ?';
          connection.query(deleteQuery, [idI], (error, results) => {
            if (error) {
              return res.status(500).send({ message: '0' }); // Error deleting image
            }
            res.status(200).json({ message: '1' }); // Image deleted successfully
          });
        });
      } else {
        res.status(404).json({ message: '2' }); // Image not found
      }
    });
});

// Get a imagen by ID
router.get('/getImage/:idI', (req, res) => {
    const { idI } = req.params;
    const query = 'SELECT * FROM imagen WHERE idI = ?';
  
    connection.query(query, [idI], (error, results) => {
      if (error) {
        return res.status(500).json({ message: '0' }); // Error retrieving imgen
      }
  
      if (results.length > 0) {
        res.status(200).json(results[0]);
      } else {
        res.status(404).json({ message: '2' }); // imagen not found
      }
    });
  }
);



module.exports = router;