//Main
require('dotenv').config();

const { NlpManager } = require('node-nlp');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const training = require('./nlp-training/training.js')

app.use(cors({
    origin: ['https://cpkbot-frontend.onrender.com', 'http://localhost:10000']
}));

// Connecting to database, MUST specify database name
mongoose.connect(process.env.MONGODB_URI, { dbName: 'CPK', useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err)
);

app.use(express.json());

const manager = new NlpManager({ languages: ['en']});
training(manager)

require('./processing/routes.js')(app, manager);

// Listen for requests
app.listen(process.env.PORT, '0.0.0.0', () => { 
    console.log(`Server started on port ${process.env.PORT}`);
});
