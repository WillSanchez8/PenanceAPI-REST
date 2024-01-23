/**
 * Nombre del archivo: controllerHomework.js
 * Descripción: Controlador de las tareas
 * Desarrolladores:
 *      - Fernando Ruiz
 * Fecha de creación: 07/01/2024
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

// search homeworks by category
router.get('/search/:category', async (req, res) => {
  const { category } = req.params;
  const query = 'SELECT * FROM homework WHERE category = ?';

  try {
    const [results] = await connection.query(query, [category]);
    if (results.length > 0) {
      res.status(200).json(results);
    } else {
      res.status(404).json({ message: '2' }); // Homework not found
    }
  } catch (error) {
    return res.status(500).json({ message: '0' }); // Error retrieving homeworks
  }
});
/*
router.get('/search/:category', (req, res) => {
  const { category } = req.params;
  const query = 'SELECT * FROM homework WHERE category = ?';

  connection.query(query, [category], (error, results) => {
    if (error) {
      return res.status(500).json({ message: '0' }); // Error retrieving homeworks
    }

    if (results.length > 0) {
      res.status(200).json(results);
    } else {
      res.status(404).json({ message: '2' }); // Homework not found
    }
  });
})

 */

// Delete a file
router.delete('/delete/:idH', async (req, res) => {
  const { idH } = req.params;
  const query = 'SELECT pdf FROM homework WHERE idH = ?';

  try {
    const [results] = await connection.query(query, [idH]);
    if (results.length > 0) {
      const filePath = path.join(appRoot.toString(), results[0].pdf);
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        return res.status(500).json({ message: '4' }); // Error deleting file
      }
      const deleteQuery = 'DELETE FROM homework WHERE idH = ?';
      await connection.query(deleteQuery, [idH]);
      res.status(200).json({ message: '1' }); // Homework deleted
    } else {
      res.status(404).json({ message: '2' }); // Homework not found
    }
  } catch (error) {
    return res.status(500).json({ message: '3' }); // Homework not found
  }
});
/*
router.delete('/delete/:idH', (req, res) => {
    const { idH } = req.params;
    const query = 'SELECT pdf FROM homework WHERE idH = ?';
  
    connection.query(query, [idH], (error, results) => {
      if (error) {
        return res.status(500).json({ message: '0' }); // Error deleting homework
      }
  
      if (results.length > 0) {
        const filePath = path.join(appRoot.toString(), results[0].pdf);
        fs.unlink(filePath, (err) => {
          if (err) {
            return res.status(500).json({ message: '4' }); // Error deleting books
          }
  
          const deleteQuery = 'DELETE FROM homework WHERE idH = ?';
          connection.query(deleteQuery, [idH], (error, results) => {
            if (error) {
              return res.status(500).send({ message: '0' }); // Error deleting homework
            }
            res.status(200).json({ message: '1' }); // Homework deleted
          });
        });
      } else {
        res.status(404).json({ message: '2' }); // Homework not found
      }
    });
  }
);

 */

// download a file pdf
router.get('/download/:idH', async (req, res) => {
  const { idH } = req.params;
  const query = 'SELECT pdf FROM homework WHERE idH = ?';

  try {
    const [results] = await connection.query(query, [idH]);
    if (results.length > 0) {
      const filePath = path.join(appRoot.toString(), results[0].pdf);
      res.download(filePath);
    } else {
      res.status(404).send({ message: '2' }); // Homework not found
    }
  } catch (error) {
    return res.status(500).json({ message: '0' }); // Error downloading homework
  }
});
/*
router.get('/download/:idH', (req, res) => {
    const { idH } = req.params;
    const query = 'SELECT pdf FROM homework WHERE idH = ?';
  
    connection.query(query, [idH], (error, results) => {
      if (error) {
        return res.status(500).json({ message: '0' }); // Error downloading homework
      }
  
      if (results.length > 0) {
        const filePath = path.join(appRoot.toString(), results[0].pdf);
        res.download(filePath);
      } else {
        res.status(404).send({ message: '2' }); // Homework not found
      }
    });
  }
);

 */

// Get a homework by ID
router.get('/getHomework/:idH', async (req, res) => {
  const { idH } = req.params;
  const query = 'SELECT * FROM homework WHERE idH = ?';

  try {
    const [results] = await connection.query(query, [idH]);
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ message: '2' }); // Homework not found
    }
  } catch (error) {
    return res.status(500).json({ message: '0' }); // Error retrieving homework
  }
});
/*
router.get('/getHomework/:idH', (req, res) => {
    const { idH } = req.params;
    const query = 'SELECT * FROM homework WHERE idH = ?';
  
    connection.query(query, [idH], (error, results) => {
      if (error) {
        return res.status(500).json({ message: '0' }); // Error retrieving homework
      }
  
      if (results.length > 0) {
        res.status(200).json(results[0]);
      } else {
        res.status(404).json({ message: '2' }); // Homework not found
      }
    });
  }
);

 */


// Get all homeworks
router.get('/getHomeworks', async (req, res) => {
  const query = 'SELECT * FROM homework';

  try {
    const [results] = await connection.query(query);
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: '0' }); // Error retrieving homeworks
  }
});
/*
router.get('/getHomeworks', (req, res) => {
    const query = 'SELECT * FROM homework';
  
    connection.query(query, (error, results) => {
      if (error) {
        return res.status(500).json({ message: '0' }); // Error retrieving homeworks
      }
      res.status(200).json(results);
    });
  }
);
 */

// Upload a file
router.post('/upload', upload.single('pdf'), async (req, res) => {
  const { title, description, publication_date, noEmployee, category } = req.body;
  const pdf = path.relative(appRoot.toString(), req.file.path);

  try {
    const [results] = await connection.query('SELECT MAX(idH) AS maxId FROM homework');
    const idH = results[0].maxId + 1;
    if (!title || !description || !category || !noEmployee) {
      res.status(400).json({ message: '2' }); // One or more fields are empty
    } else {
      const query = 'INSERT INTO homework (idH, title, description, publication_date, pdf, noEmployee, category) VALUES (?, ?, ?, ?, ?, ?, ?)';
      await connection.query(query, [idH, title, description, publication_date, pdf, noEmployee, category]);
      res.status(201).json({ message: '1' }); // Homework created
    }
  } catch (error) {
    return res.status(500).json({ message: '0' }); // Error creating homework
  }
});
/*
router.post('/upload', upload.single('pdf'), (req, res) => {
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

 */

  module.exports = router;