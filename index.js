/**
 * Nombre del archivo: index.js
 * Descripción: Archivo principal del servidor
 * Desarrolladores:
 *      - Fernando Ruiz
 *      - Laura Ramirez
 *      - Nahum Hernandez
 *      - William Aguilar
 * Fecha de creación: 28/12/2023
 * Fecha de modificación: 23/01/2024
 */

const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const adminRoutes = require('./controllers/controllerAdmin');
const homeworkRoutes = require('./controllers/controllerHomework');
const userRoutes = require('./controllers/controllerUser');
const sliderRoutes = require('./controllers/controllerSlider');
const bookRoutes = require('./controllers/controllerBook');
const imags = require('./controllers/controllerImage');
const task = require('./controllers/controllerTask');
const path = require('path');

const app = express();
dotenv.config();

app.use(cors());

app.use(bodyParser.json());

app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/admin', adminRoutes);
app.use('/homework', homeworkRoutes);
app.use('/user', userRoutes);
app.use('/slider', sliderRoutes);
app.use('/book', bookRoutes);
app.use('/image', imags);
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/task',task);


app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${process.env.PORT}`);
});