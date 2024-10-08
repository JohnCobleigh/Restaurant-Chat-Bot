//Main
require('dotenv').config();

const { NlpManager } = require('node-nlp');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const training = require('./training.js')
const {checkOrder, displayPartialMenu, checkout} = require('./orderVerification')
const { MainPlate, Margarita, Martini, Mocktail, Pasta, Pizza, Salad, Sangria, Cocktail, Starter, Dessert } = require('./models/item.js')
const { Order } = require('./models/order.js')
const { 
    validPizzas, validPastas, validMargaritas, 
    ValidMartinis, validMocktails, validSalads, validSangrias, 
    validCocktails, validStarters, validDesserts 
} = require("./validOrders");

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
    starter: Starter,
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
   
app.post('/', async(req, res) => {
    const { message } = req.body;

    //Responce from the nlp, what it determines the resopnse, intent, entities, etc. to be
    const response = await manager.process('en', message);
    const intent  = response.intent;
    const entities = response.entities;

    //Determines if the response given is understood to be something that exists
    if(intent === 'None'){
        return res.json({reply: 'I dont understand what you want'})
    }
     
    // console.log(response)
    // console.log(Pizza.name)
    // console.log(validPizzas)

    //Start of the section determining what to respond with
    if(intent === 'item.show.all'){
       
        const answer = await displayPartialMenu(entities, itemCollectionMap)
        return res.json({ reply: answer })

    }
    // Adding to order
    else if(intent === 'order'){
        // console.log("TESTSETS")
        // console.log(response)
        
        const output =  await checkOrder(response, itemCollectionMap)

        // console.log(output)
        res.json({ reply: output });
    }
    // Finalizing order
    else if (intent === 'finalOrder'){
        const output = await checkout()

        return res.json({reply: output})
    }
    else {
        const answer = response.answer;
        res.json({ reply: answer });
    }
});


// Listen for requests
app.listen(process.env.PORT, () => { 
    console.log(`Server started on port ${process.env.PORT}`);
});
