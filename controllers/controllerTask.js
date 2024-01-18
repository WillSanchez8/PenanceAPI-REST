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

  router.post('/create', uploadTask.single('url'), (req, res) => {
    const { noStudent, idH, status } = req.body;
    let url = null;

    // Verifica si los campos no están vacíos
    if (!noStudent && !idH) {
      res.status(400).json({ message: '2' }); // One or more fields are empty
    } else {
      // Verifica si el archivo fue cargado
      if (req.file) {
        url = path.relative(appRoot.toString(), req.file.path);
      }

      const query = url
        ? 'INSERT INTO users_work (noStudent, idH, status, url) VALUES (?, ?, 1, ?)'
        : 'INSERT INTO users_work (noStudent, idH, status) VALUES (?, ?, 1)';

      connection.query(query, [noStudent, idH, url], (error, results) => {
        if (error) {
          return res.status(500).json({ message: '0' }); // Error creating task
        }
        res.status(201).json({ message: '1' }); // task created
      });
    }
  });

  //Update status task to 0
  router.put('/status', (req, res) => {
    const { noStudent, idH } = req.body;
    const updateQuery = 'UPDATE users_work SET status = 0 WHERE noStudent = ? AND idH = ?';

    connection.query(updateQuery, [noStudent, idH], (error, results) => {
      if (error) {
        return res.status(500).json({ message: '0' });
      }
      res.status(200).json({ message: '1' });
    });
  });


  // Delete a file
  router.delete('/delete', (req, res) => {
    const { noStudent, idH } = req.body;
    console.log(req.body);
    const query = 'SELECT url FROM users_work WHERE noStudent = ? AND idH = ?';

    connection.query(query, [noStudent, idH], (error, results) => {
      if (error) {
        return res.status(500).json({ message: '3' }); // book not found
      }

      if (results.length > 0 && results[0] && results[0].url) {//
        const filePath = path.join(appRoot.toString(), results[0].url);
        fs.unlink(filePath, (err) => {
          if (err) {
            return res.status(500).json({ message: '4' }); // Error deleting books
          }

          const deleteQuery = 'DELETE FROM users_work WHERE noStudent = ? AND idH = ?';
          connection.query(deleteQuery, [noStudent, idH], (error, results) => {
            if (error) {
              return res.status(500).json({ message: '0' }); // Error deleting books
            }
            res.status(200).json({ message: '1' }); // Homework books
          });
        });
      } else {
        console.log(results);//no hay nada
        res.status(404).json({ message: '2' }); // 
      }
    });
  }
  );

  //Elimina el registro completo de la tarea
  router.delete('/deleteTaskComplete', (req, res) => {
    const { idH, noStudent } = req.body;
    const query = 'DELETE FROM users_work WHERE idH = ? AND noStudent = ?';

    connection.query(query, [idH, noStudent], (error, results) => {
      if (error) {
        return res.status(500).json({ message: '0' }); // Error deleting books
      }
      res.status(200).json({ message: '1' }); // Homework books
    });
  }
  );
    

module.exports = router;
