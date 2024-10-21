//Main
require('dotenv').config();

const { NlpManager } = require('node-nlp');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const training = require('./training.js')
const {addToOrder, displayPartialMenu, placeOrder, removeFromOrder, displayGeneralMenu, 
       displayIngredients, displayCalories, displayDescription, displayCurrentOrder, updateOrder} = require('./orderVerification')
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
    ...Object.fromEntries(['starters', 'starter'].map(key => [key, Starter])),
    ...Object.fromEntries(['dessert', 'dessert'].map(key => [key, Dessert]))
}

const drinkSections = ['Cocktails', 'Margaritas', 'Martinis', 'Mocktails', 'Sangrias'];
const foodSections = ['Main Plates', 'Pastas', 'Pizzas', 'Salads', 'Starters', 'Desserts'];

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

    //console.log(intent)
    console.log(entities)

    // Determines if the response given is understood to be something that exists
    if(intent === 'None'){
        return res.json({reply: 'I don\'t understand what you want.'})
    }

    // Following if & if-else statements call upon functions in orderVerification.js based on intent from input  

    // Display what sections of the menu there are
    if(intent === 'menu.ask'){
        const drinksFormatted = await displayGeneralMenu(drinkSections);
        const foodFormatted = await displayGeneralMenu(foodSections);

        const nlpAnswer = response.answer.replace('*food sections here*', foodFormatted).replace('*drink sections here*', drinksFormatted);
        return res.json({ reply: nlpAnswer })
    }

    else if(intent === 'food.ask'){
        const foodFormatted = await displayGeneralMenu(foodSections);
        const nlpAnswer = response.answer.replace('*food sections here*', foodFormatted);
        return res.json({ reply: nlpAnswer })
    }

    else if(intent === 'drink.ask'){
        const drinksFormatted = await displayGeneralMenu(drinkSections);
        const nlpAnswer = response.answer.replace('*drink sections here*', drinksFormatted);
        return res.json({ reply: nlpAnswer })
    }

    // Display all items in a specific section
    else if(intent === 'item.show.all'){
        const answer = await displayPartialMenu(entities, itemCollectionMap)

        if (answer == null){
            res.json({ reply: `Sorry, I couldn't understand which item you're looking for <b>\u2639</b>.<br /><br />Feel free to ask me what type of items we serve!` })
        }

        // pulling item type from input entities
        const itemEntity = entities.find(e => e.entity === 'item');
        const item = itemEntity.option;

        const nlpAnswer = response.answer.replace('*items here*', answer).replace('%item%', item)
        return res.json({ reply: nlpAnswer })
    }
    
    // Display list of ingredients for a specific item
    else if(intent === 'show.ingredients'){
        const answer = await displayIngredients(entities, itemCollectionMap)

        if (answer == null){
            return res.json({ reply: `We currently do <i>not</i> serve the item(s) you want to know more about <b>\u2639</b>.<br /><br />If you have any questions about menu, don't hesitate to ask me!`})
        }

        const itemEntity = entities.find(e => e.entity === 'add.to.order');
        const item = itemEntity.sourceText;

        const nlpAnswer = response.answer.replace('*ingredients here*', answer).replace('%item%', item)
        return res.json({ reply: nlpAnswer })
    }

    else if(intent === 'show.description'){
        const answer = await displayDescription(entities, itemCollectionMap)

        if (answer == null){
            return res.json({ reply: `We currently do <i>not</i> serve the item(s) you want to know more about <b>\u2639</b>.<br /><br />If you have any questions about menu, don't hesitate to ask me!`})
        }

        const itemEntity = entities.find(e => e.entity === 'add.to.order');
        const item = itemEntity.sourceText;

        const nlpAnswer = response.answer.replace('*description here*', answer).replace('%item%', item)
        return res.json({ reply: nlpAnswer })
    }

    else if(intent === 'show.calories'){
        const answer = await displayCalories(entities, itemCollectionMap)

        if (answer == null){
            return res.json({ reply: `We currently do <i>not</i> serve the item(s) you want to know more about <b>\u2639</b>.<br /><br />If you have any questions about menu, don't hesitate to ask me!`})
        }

        const itemEntity = entities.find(e => e.entity === 'add.to.order');
        const item = itemEntity.sourceText;

        const nlpAnswer = response.answer.replace('*calories here*', answer).replace('%item%', item)
        return res.json({ reply: nlpAnswer })
    }

    // Adding to order
    else if(intent === 'add.to.order'){
        const answer =  await addToOrder(entities, itemCollectionMap)

        if (answer == null)
        {
            return res.json({ reply: `We currently do <i>not</i> serve the item(s) you want to order <b>\u2639</b>.<br /><br />Ask me about our menu for more info!`})
        }

        const nlpAnswer = response.answer.replace('%order%', answer)
        res.json({ reply: nlpAnswer });
    }

    // Removing from order
    else if(intent === 'remove.from.order'){
        const answer = await removeFromOrder(entities)

        if(answer == null)
        {
            return res.json({ reply: 'Your order currently does <i>not</i> have the item(s) you want to remove.<br /><br />You can ask me what\'s in your cart at anytime!'})
        }

        const nlpAnswer = response.answer.replace('%order%', answer)
        return res.json({ reply: nlpAnswer })
    }

    // Update item in current order
    else if(intent === 'update.order'){
        const answer = await updateOrder(entities, itemCollectionMap)
        return res.json({ reply: answer }) 
    }

    // Display current order 
    else if(intent === 'current.order'){
        const answer = await displayCurrentOrder()

        if(answer == null)
        {
            return res.json({ reply: 'You currently <i>don\'t</i> have anything in your cart. <br /><br /> Let me know if you have questions about our menu!'})
        }

        const nlpAnswer = response.answer.replace('*current order here*', answer)
        return res.json({ reply: nlpAnswer })
    }

    // Finalizing order
    else if(intent === 'place.order'){
        const answer = await placeOrder()

        if(answer == null)
        {
            return res.json({ reply: 'You currently <i>don\'t</i> have anything in your cart. <br /><br /> Be sure to add any items to your cart before placing an order!'})
        }

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
