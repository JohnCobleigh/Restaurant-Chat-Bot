const {addToOrder, displayPartialMenu, placeOrder, removeFromOrder, displayGeneralMenu, 
       displayCurrentOrder, updateOrder, afterDecision, giveRecommendation, setPreviousRecommendation, 
       clearOrder, conversation, previousRecommendation, displaySpecificInfo, setOrderConfirmation, getOrderConfirmation} = require('./functions')
       
const drinkSections = ['Cocktails', 'Margaritas', 'Martinis', 'Mocktails', 'Sangrias'];
const foodSections = ['Main Plates', 'Pastas', 'Pizzas', 'Salads', 'Starters', 'Desserts'];

module.exports = (app, manager) => {
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
    
        console.log(response)
        // console.log(intent)
        // console.log(entities)
        
        if(intent != 'None'){
            conversation.push(response)
        }
    
        if(conversation.length  > 1){
            if(conversation[conversation.length - 2].intent != 'recommend'){
                setPreviousRecommendation(null)
            }
        }
    
    
        // console.log(previousRecommendation)
        // console.log(conversation)
    
    
        // Determines if the response given is understood to be something that exists
        if(intent === 'None'){
            return res.json({reply: 'I don\'t understand what you want.'})
        }
    
        // Following if & if-else statements call upon functions in orderVerification.js based on intent from input  
        // TODO: Maybe put all the intent testing into a different file for a cleaner main
    
        // Display what sections of the menu there are
        if(intent === 'menu.ask'){
            const drinksFormatted = await displayGeneralMenu(drinkSections);
            const foodFormatted = await displayGeneralMenu(foodSections);
    
            const nlpAnswer = response.answer.replace('*food sections here*', foodFormatted).replace('*drink sections here*', drinksFormatted);
            return res.json({ reply: nlpAnswer })
        }
    
        //Shows the items under the food type requested
        else if(intent === 'food.ask'){
            const foodFormatted = await displayGeneralMenu(foodSections);
            const nlpAnswer = response.answer.replace('*food sections here*', foodFormatted);
            return res.json({ reply: nlpAnswer })
        }
    
        //Displays the drinks when prompted
        else if(intent === 'drink.ask'){
            const drinksFormatted = await displayGeneralMenu(drinkSections);
            const nlpAnswer = response.answer.replace('*drink sections here*', drinksFormatted);
            return res.json({ reply: nlpAnswer })
        }
    
        // Display all items in a specific section
        else if(intent === 'item.show.all'){
            const answer = await displayPartialMenu(entities)
    
            if (answer == null){
                res.json({ reply: `Sorry, I couldn't understand which item you're looking for <b>\u2639</b>.<br /><br />Feel free to ask me what type of items we serve!` })
            }
    
            // pulling item type from input entities
            const itemEntity = entities.find(e => e.entity === 'item');
            const item = itemEntity.option;
    
            const nlpAnswer = response.answer.replace('*items here*', answer).replace('%item%', item)
            return res.json({ reply: nlpAnswer })
        }
    
        // Display specific info about an item
        else if (intent === 'show.description' || intent === 'show.ingredients' || intent === 'show.calories' || intent === 'show.price'){
            const answer = await displaySpecificInfo(entities, intent)
    
            if (answer == null){
                return res.json({ reply: `We currently do <i>not</i> serve the item(s) you want to know more about <b>\u2639</b>.<br /><br />If you have any questions about menu, don't hesitate to ask me!`})
            }
    
            const itemEntity = entities.find(e => e.entity === 'add.to.order');
            const item = itemEntity.sourceText + " " + itemEntity.option;
    
            const nlpAnswer = response.answer.replace('*info here*', answer).replace('%item%', item)
            return res.json({ reply: nlpAnswer })
        }
    
        else if(intent === 'recommend'){
            const answer = await giveRecommendation(entities)
    
            if (answer == null){
                return res.json({ reply: `I dont have any recommendations to give you <b>\u2639</b>.<br /><br />If you have any questions about menu, don't hesitate to ask me!`})
            }
    
            const itemEntity = entities.find(e => e.entity === 'item');
            const item = itemEntity.sourceText;
    
            const nlpAnswer = response.answer.replace('*recommendation*', answer).replace('%item%', item)
            return res.json({ reply: nlpAnswer })
            
        }
    
        // Adding to order
        else if(intent === 'add.to.order'){
            const answer =  await addToOrder(entities)
    
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
            const answer = await updateOrder(entities)
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
            if(getOrderConfirmation()){
                const answer = await placeOrder()
                console.log(getOrderConfirmation())
    
                if(answer == null)
                {
                    return res.json({ reply: 'You currently <i>don\'t</i> have anything in your cart. <br /><br /> Be sure to add any items to your cart before placing an order!'})
                }
    
                const nlpAnswer = response.answer.replace('*receipt here*', answer);
                return res.json({ reply: nlpAnswer })
            }
            else{
                const answer = await placeOrder()
                return res.json({ reply: answer })
            }
            
        }
    
        //Clears the order
        else if(intent === 'clear.order'){
            clearOrder();
            const answer = response.answer
            
            return res.json({ reply: answer })
        }

        //Tests users decision input
        else if(intent === 'answer.yes' || intent === 'answer.no' || intent === 'answer.order.that'){
            // console.log("TESTETS");
    
            if(intent === 'answer.no'){
                setOrderConfirmation(false)
                return;
            }
            
            const answer = await afterDecision(response)
            const nlpAnswer = response.answer
            console.log(answer)
            return res.json({ reply: nlpAnswer });
        }
    
        //Error test
        else {
            const answer = response.answer;
            res.json({ reply: answer });
        }
    });
};