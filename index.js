const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const db = require('./db');
const adminRoutes = require('./controllers/controllerAdmin');
const homeworkRoutes = require('./controllers/controllerHomework');
const userRoutes = require('./controllers/controllerUser');
const sliderRoutes = require('./controllers/controllerSlider');
const bookRoutes = require('./controllers/controllerBook');

const app = express();
dotenv.config();

app.use(bodyParser.json());

app.use('/admin', adminRoutes);
app.use('/homework', homeworkRoutes);
app.use('/user', userRoutes);
app.use('/slider', sliderRoutes);
app.use('/book', bookRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
