//Main
require('dotenv').config();


const { NlpManager } = require('node-nlp');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const training = require('./training')
const {Pizza} = require('./models')

const menuItemSchema = new mongoose.Schema({
    name: String,
    price: Number
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);



app.use(cors({
    origin: 'http://localhost:3000'
}));


//mongoose.connect(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err)
);

app.use(express.json());

const manager = new NlpManager({ languages: ['en']});
training(manager)


app.get('/', (req, res) => {
    res.send('Chatbot server is running!');
});
  

app.post('/', async(req, res) => {
    // console.log("Received POST request at '/'");
    const { message } = req.body;
    // console.log("Message received:", message);

    const response = await manager.process('en', message);

    console.log(response)
    console.log(Pizza)


    var messaage = response.intent
    /*
    if(response.intent === 'menu.ask'){
        const menuItems = await MenuItem.find();
        const menuText = menuItems.map(item => `${item.name} - $${item.price}`).join(', ');

        const answer = await response.answer;

        res.json({ reply: `${answer} ${menuText}` });
    }
    else if(response.intent === 'None'){
        res.json({reply: 'I dont understand what you want'})
    }
    else
        res.json({reply: 'Error seeing this'})
    */


    if(response.intent === 'None'){
        res.json({reply: 'I dont understand what you want'})
    }
    else{
        if(response.intent === 'pizza.show.all'){
            const pizzas = await Pizza.find();

            // if(pizzas.length === 0){
            //     console.log("No pizzas found")
            //     return
            // }
            
            const pizzaNames = pizzas.map(pizza => pizza.name).join(', ');
            
            res.json({ reply: 'Here are our pizzas:', pizzas: pizzaNames });

            console.log(pizzaNames)
            console.log("HALSKS")
            return
        }
        const answer = await response.answer;
        res.json({ reply: `${answer}` });
    }


 });



// Listen for requests
app.listen(process.env.PORT, () => { 
    console.log(`Server started on port ${process.env.PORT}`);
});
