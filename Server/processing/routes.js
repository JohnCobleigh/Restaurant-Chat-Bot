const {addToOrder, displayPartialMenu, placeOrder, removeFromOrder, displayCurrentOrder, updateOrder,
       afterDecision, giveRecommendation, clearOrder, setOrderConfirmation, getOrderConfirmation,
       setPreviousRecommendation, conversation, previousRecommendation, displaySpecificInfo, getImage, setTempReceipt} = require('./functions')
       
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

        if(getOrderConfirmation() && intent != 'answer.yes'){
            setOrderConfirmation(false)
        }
    
        // Determines if the response given is understood to be something that exists
        if(intent === 'None'){
            return res.json({reply: 'I don\'t understand what you want.'})
        }
    
        // Following if & if-else statements call upon functions in orderVerification.js based on intent from input  
    
        // Display what sections of the menu there are
        if(intent === 'menu.ask' || intent === 'food.ask' || intent === 'drink.ask'){
            const nlpAnswer = response.answer;
            const messages = nlpAnswer.split("...")

            return res.json({ replies: messages })
        }
    
        // Display all items in a specific section
        else if(intent === 'item.show.all'){
            const answer = await displayPartialMenu(entities)
    
            if (answer == null){
                return res.json({ reply: `Sorry, I couldn't understand which item you're looking for <b>\u2639</b>.<br /><br />Feel free to ask me what type of items we serve!` })
            }
    
            // pulling item type from input entities
            const itemEntity = entities.find(e => e.entity === 'item');
            const item = itemEntity.option;
    
            const nlpAnswer = response.answer.replace('*items here*', answer).replace('%item%', item)
            const messages = nlpAnswer.split("...")

            return res.json({ replies: messages })
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
            const messages = nlpAnswer.split("...")

            if (intent === 'show.description'){
                const url = await getImage(entities)
                return res.json ({ replies: messages, imageURL: url }) 
            }

            return res.json({ replies: messages })
        }
    
        // Provide recommendation if user asks
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
    
            /*if(answer == null)
            {
                return res.json({ reply: 'You currently <i>don\'t</i> have anything in your cart. <br /><br /> Let me know if you have questions about our menu!'})
            }*/

            if(answer == null)
            {
                return res.json({ replies: ['You currently <i>don\'t</i> have anything in your cart.',
                                            'Let me know if you have questions about our menu!'] })
            }
    
            const nlpAnswer = response.answer.replace('*current order here*', answer)
            const messages = nlpAnswer.split("...")

            return res.json({ replies: messages })
        }
    
        // Finalizing order
        else if(intent === 'place.order'){
            await setOrderConfirmation(false)
            const answer = await placeOrder(response)
    
            if(answer == null)
            {
                return res.json({ reply: 'You currently <i>don\'t</i> have anything in your cart. <br /><br /> Be sure to add any items to your cart before placing an order!'})
            }
            
            // const nlpAnswer = response.answer.replace('*receipt here*', "");
            return res.json({ reply: answer }) 
        }

        else if(intent === 'clear.order'){
            clearOrder();
            const answer = response.answer
            
            return res.json({ reply: answer })
        }

    
        // Handle yes/no responses
        else if(intent === 'answer.yes' || intent === 'answer.no' || intent === 'answer.order.that'){
            if(intent === 'answer.no'){
                setTempReceipt()
                setOrderConfirmation(false)
                const tempReply = `Would you like to add something else to your order?`
                console.log(tempReply)
                return res.json({ reply: tempReply });
            }
            
            const answer = await afterDecision(response)
            const nlpAnswer = response.answer
            console.log("ASDSAD", answer, "DSAAS")

            
            return res.json({ reply: answer });
        }
    
        else {
            const answer = response.answer;
            res.json({ reply: answer });
        }
    });
};