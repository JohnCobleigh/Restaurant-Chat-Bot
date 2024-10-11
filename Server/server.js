//Main
require('dotenv').config();

const { NlpManager } = require('node-nlp');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const training = require('./training.js')
const {addToOrder, displayPartialMenu, placeOrder, removeFromOrder, displayGeneralMenu, displayIngredients} = require('./orderVerification')
const { MainPlate, Margarita, Martini, Mocktail, Pasta, Pizza, Salad, Sangria, Cocktail, Starter, Dessert } = require('./models/item.js')
const { Order } = require('./models/order.js')

// Need to find better solution fr
// Does not work with entrees/main plates
const itemCollectionMap = {
    //pizzas: Pizza,
    ...Object.fromEntries(['pizzas', 'pizza'].map(key => [key, Pizza])),
    ...Object.fromEntries(['pastas', 'pasta'].map(key => [key, Pasta])),
    ...Object.fromEntries(['entrees', 'entree'].map(key => [key, MainPlate])),
    ...Object.fromEntries(['margaritas', 'margarita'].map(key => [key, Margarita])),
    ...Object.fromEntries(['martinis', 'martini'].map(key => [key, Martini])),
    ...Object.fromEntries(['mocktails', 'mocktail'].map(key => [key, Mocktail])),
    ...Object.fromEntries(['salads', 'salad'].map(key => [key, Salad])),
    ...Object.fromEntries(['sangrias', 'sangria'].map(key => [key, Sangria])),
    ...Object.fromEntries(['cocktails', 'cocktail'].map(key => [key, Cocktail])),
    ...Object.fromEntries(['starters', 'starter'].map(key => [key, Starter]))
    // Dessert: Dessert
}


app.use(cors({
    origin: 'http://localhost:5173/'
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
   
// Intent routing/processing
app.post('/', async(req, res) => {
    const { message } = req.body;

    // Response from the nlp, what it determines the response, intent, entities, etc. to be
    const response = await manager.process('en', message);
    const intent  = response.intent;
    const entities = response.entities;

    // Determines if the response given is understood to be something that exists
    if(intent === 'None'){
        return res.json({reply: 'I dont understand what you want'})
    }
     
    // Following if & if-else statements call upon functions in orderVerification.js based on intent from input  

    // Display what sections of the menu there are
    if (intent === 'menu.ask'){
        const drinkSections = ['Cocktails', 'Margaritas', 'Martinis', 'Mocktails', 'Sangrias'];
        const foodSections = ['Main Plates', 'Pastas', 'Pizzas', 'Salads', 'Starters', 'Desserts'];

        const drinksFormatted = await displayGeneralMenu(drinkSections);
        const foodFormatted = await displayGeneralMenu(foodSections);

        const nlpAnswer = response.answer.replace('*food sections here*', foodFormatted).replace('*drink sections here*', drinksFormatted);
        return res.json({ reply: nlpAnswer })
    }

    // Display all items in a specific section
    else if(intent === 'item.show.all'){
        // pulling item type from input entities
        const itemEntity = entities.find(e => e.entity === 'item');
        const item = itemEntity.option;

        const answer = await displayPartialMenu(entities, itemCollectionMap)
        const nlpAnswer = response.answer.replace('*items here*', answer).replace('%item%', itemEntity.utteranceText)
        return res.json({ reply: nlpAnswer })
    }

    // Display list of ingredients for a specific item
    else if(intent === 'show.ingredients'){
        // pulling item type from input entities
        const itemEntity = entities.find(e => e.entity === 'add.to.order');
        const item = itemEntity.sourceText;

        const answer = await displayIngredients(response, itemCollectionMap)
        const nlpAnswer = response.answer.replace('*ingredients here*', answer).replace('%item%', item)
        return res.json({ reply: nlpAnswer })
    }

    // Adding to order
    else if(intent === 'add.to.order'){
        const answer =  await addToOrder(response, itemCollectionMap)
        const nlpAnswer = response.answer.replace('%order%', answer)
        res.json({ reply: nlpAnswer });
    }

    // Removing from order
    else if(intent === 'remove.from.order'){
        const answer = await removeFromOrder(response)
        const nlpAnswer = response.answer.replace('%order%', answer)
        return res.json({ reply: nlpAnswer })
    }

    // Finalizing order
    else if (intent === 'place.order'){
        const answer = await placeOrder()
        const nlpAnswer = response.answer.replace('*receipt here*', answer);
        return res.json({ reply: nlpAnswer })
    }

    else {
        const answer = response.answer;
        res.json({ reply: answer });
    }
});


// Listen for requests
app.listen(process.env.PORT, '0.0.0.0', () => { 
    console.log(`Server started on port ${process.env.PORT}`);
});
