//Main
require('dotenv').config();


const { NlpManager } = require('node-nlp');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const training = require('./training.js')
const { MainPlate, Margarita, Martini, Mocktail, Pasta, Pizza, Salad, Sangria, Cocktail, Starter } = require('./models/item.js')

app.use(cors({
    origin: 'http://localhost:3000'
}));

// Connecting to database, MUST specify database name
mongoose.connect(process.env.MONGODB_URI, { dbName: 'CPK', useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err)
);

app.use(express.json());

const manager = new NlpManager({ languages: ['en']});
training(manager)

app.get('/', async (req, res) => {
    res.send('Chatbot server is running!');
});
   
app.post('/', async(req, res) => {
    const { message } = req.body;

    // nlp.js stuff
    const response = await manager.process('en', message);

    const intent  = response.intent;
    const entities = response.entities;

    if(intent === 'None'){
        return res.json({reply: 'I dont understand what you want'})
    }
     
    // leaving this reference, but removable
    /*if(intent === 'pizza.show.all'){
        const pizzas = await Pizza.find({}).exec(); // finds all documents in "pizzas"
        console.log("Pizzas: ", pizzas);

        if (pizzas.length === 0) {
            return res.json({ reply: "No pizzas found." });
        }

        const pizzaNames = pizzas.map(pizza => pizza.name).join(', ');
            
        return res.json({ reply: `Here are our pizzas: ${pizzaNames}`})
    } */


    if(intent === 'item.show.all'){
        // looking for what constitutes as an item (look at lines 37-48 in training.js)
        const itemEntity = entities.find(e => e.entity === 'item');
        
        if (!itemEntity) {
            return res.json({ reply: "Sorry, I couldn't understand which item you're looking for." });
        }

        const item = itemEntity.option;

        // matching item recognized in input to schema imported from item.js
        const itemCollectionMap = {
            pizza: Pizza,
            pasta: Pasta,
            plate: MainPlate,
            margarita: Margarita,
            martini: Martini,
            mocktail: Mocktail,
            salad: Salad,
            sangria: Sangria,
            cocktail: Cocktail,
            starter: Starter
        }

        const collection = itemCollectionMap[item.toLowerCase()]

        if (!collection){
            return res.json({ reply: `We do not serve any ${item}s.`})
        }

        const items = await collection.find({}).exec(); // finds all documents for a specific item
    
        if (items.length === 0) {
            return res.json({ reply: `No ${item}s found.` });
        }
    
        const itemNames = items.map(i => i.name).join(', ');

        return res.json({ reply: `Here are our ${item}s: ${itemNames}`})
    }

    const answer = response.answer;
    res.json({ reply: answer });
 });


// Listen for requests
app.listen(process.env.PORT, () => { 
    console.log(`Server started on port ${process.env.PORT}`);
});
