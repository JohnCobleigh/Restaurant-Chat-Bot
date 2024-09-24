require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000'
}));

const mongoose = require('mongoose');
//mongoose.connect(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['en']});

app.use(express.json());

const menuItemSchema = new mongoose.Schema({
    name: String,
    price: Number
});
const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// training
manager.addDocument('en', 'What is on the menu?', 'menu.ask');
manager.addDocument('en', 'What items do you have?', 'menu.ask');
manager.addDocument('en', 'Show me the menu', 'menu.ask');

manager.addAnswer('en', 'menu.ask', 'Here is the menu: ');

app.get('/', (req, res) => {
    res.send('Chatbot server is running!');
  });
  

app.post('/', async(req, res) => {
    const { message } = req.body;
    const response = await manager.process('en', message);

    if(response.intent === 'menu.ask'){
        const menuItems = await MenuItem.find();
        const menuText = menuItems.map(item => `${item.name} - $${item.price}`).join(', ');
        res.json({ reply: `Here is the menu: ${menuText}` });
    }
});

// Listen for requests
app.listen(process.env.PORT, () => { 
    console.log(`Server started on port ${process.env.PORT}`);
});
