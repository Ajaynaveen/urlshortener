const express = require('express');

const cors = require('cors');
const mongoose = require('mongoose');
const userroutes = require('./routes/userroutes');

const urlRoutes = require('./routes/urlRoutes');



const app = express();
app.use(cors());
const port = 3003;



const url = 'mongodb+srv://ajaysnaviee:2xMYRIUEm7XjEjm9@cluster0.jvsps7g.mongodb.net/UrlUser?retryWrites=true&w=majority';

mongoose.connect(url);

const db = mongoose.connection;
db.once('open', () => {
  console.log('Database connected');
});
db.on('error', console.error.bind(console, 'Connection error'));


app.use(express.json());

app.use('/', userroutes);
app.use('/', urlRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});