const { model } = require("mongoose");
const { Order } = require('./models/order.js')

// store overall current order
let names = []
let calories = []
let modifiers = []
let prices = []
let conversation = []

var previousRecommendation = null

async function addToOrder(entities, itemCollectionMap){
    let collection = '';
    let orderDetails = '';
    let modify = '';
    let ingredients = []

    // used to store items that are **currently** being ordered
    let tempNames = []
    let tempCalories = []
    let tempModifiers = []
    let tempPrices = []

    // loop through array of entities provided by nlp.js
    for (let e of entities){
        const option = e.option;                // pulling item type from optionEntity object
        const sourceText = e.sourceText         // pulling specific name from optionEntity object

        // skip over current entity/word if it is just an item type (ex. pizza, pasta, etc.)
        if (option == sourceText){
            continue;
        }

        // (debugging stuff)
        //console.log(optionEntity)
        console.log("option: " + option)              // item type (i.e. pizza, pasta, etc.)
        console.log("source text: " + sourceText)     // item name (i.e Thai Chicken)

        // search for specific food or drink in collection
        let item = ''

        if (e.entity == 'add.to.order'){
            collection = itemCollectionMap[option.toLowerCase()]              // matching item type to Mongoose schema (see item.js and server.js)
            console.log(collection)                                           // Mongoose schema (i.e. { Pizza })

            sourceText.replace(/[^\w\s]/gi, '') // remove punctuation and other special chars
            item = await collection.findOne({ name: { $regex: new RegExp(`^${sourceText}$`, "i") } }).exec()

            if (!item)
                return res.json({ reply: `We do not serve a ${sourceText}.`})


            // push item info to order-related arrays
            names.push(item.name)
            calories.push(item.calories)
            prices.push(item.price)

            // push same info to temp arrays for items being **currently** ordered
            tempNames.push(item.name)
            tempCalories.push(item.calories)
            tempPrices.push(item.price)

            console.log(names)
            continue;
        }

        if (e.entity == 'modify'){
            if (option == 'positive'){
                modify = 'with'
            }
            else if(option == 'negative'){
                modify = 'without'
            }
            else{
                modify = ''
            }
            continue;
        }

        if (e.entity == 'ingredients'){
            ingredients.push(option)
            //continue;
        }

        modifiers.push(modify.concat(" ", ingredients))
        tempModifiers.push(modify.concat(" ", ingredients))

        modify = '';
        ingredients = [];
    }

    // formatting output
    orderDetails = tempNames.map((name, index) => {
        const modifier = tempModifiers[index] ? tempModifiers[index] : '';

        if (tempNames.length == 1 || (index == tempNames.length - 2 && tempNames.length == 2))
            return `<b>${name}</b>${modifier}`

        if (index == tempNames.length - 1 && tempNames.length > 1) {
            return `and <b>${name}</b>${modifier}`;
        }

        return ` <b>${name}</b>${modifier},`
    }).join(' ');

    // if user didn't order anything found on menu, return null
    if (orderDetails == null || orderDetails == '')
        return null

    return orderDetails
}

async function removeFromOrder(entities){
    // storing items **currently** being removed
    let tempNames = [];
    let tempModifiers = [];

    // basically same logic as adding to order
    for (e of entities){
        if (e.entity === 'add.to.order'){
            const index = names.indexOf(e.sourceText);

            if (index > -1){
                tempNames.push(names[index])
                tempModifiers.push(modifiers[index])

                names.splice(index, 1)
                calories.splice(index, 1)
                modifiers.splice(index, 1)
                prices.splice(index, 1)
            }

            // if item isn't in current order, ignore it for now
            else if (index < 0){
                continue;
            }

            console.log(names)
        }
    }   

    orderDetails = tempNames.map((name, index) => {
        const modifier = tempModifiers[index] ? tempModifiers[index] : '';

        if (tempNames.length == 1 || (index == tempNames.length - 2 && tempNames.length == 2))
            return `<b>${name}</b>${modifier}`

        if (index == tempNames.length - 1 && tempNames.length > 1) {
            return `and <b>${name}</b>${modifier}`;
        }

        return ` <b>${name}</b>${modifier},`
    }).join(' ');

    // if user didn't remove an item in their current order, return null
    if (orderDetails == null || orderDetails == '')
        return null

    return orderDetails
}

async function displayCurrentOrder(){
    // return null if order-related arrays are empty (only checking names array assuming each array is updated properly)
    if (names.length == 0){
        return null
    }

    const orderDetails = names.map((name, index) => {
        const modifier = modifiers[index] ? modifiers[index] : '';
        return `\u2022 <b>${name}</b> ${modifier} [cal.${calories[index]}] [$${prices[index]}]`
    }).join('<br /><br />');

    let calTotal = calories.reduce((partialSum, a) => partialSum + a, 0);
    let subtotal = prices.reduce((partialSum, a) => partialSum + a, 0);

    return `<br /><br />${orderDetails}<br /><br />
            Total calories: ${calTotal}<br /><br />
            Subtotal: $${subtotal}<br />
            Tax: $${(subtotal * 0.0825).toFixed(2)}<br />
            Total: <b>$${(subtotal + subtotal * 0.0825).toFixed(2)}</b><br /><br />`; 
}

async function placeOrder(){
    // return null if order-related arrays are empty (only checking names array assuming each array is updated properly)
    if (names.length == 0){
        return null;
    }

    // created new document to store in MongoDB using Mongoose schema
    const receipt = new Order({names: names, calories: calories, modifiers: modifiers, prices: prices})
    await receipt.save();

    let calTotal = calories.reduce((partialSum, a) => partialSum + a, 0);
    let subtotal = prices.reduce((partialSum, a) => partialSum + a, 0);

    // reset order-related arrays
    names.length = 0;
    calories.length = 0;
    modifiers.length = 0;
    prices.length = 0;  

    const receiptDetails = receipt.names.map((name, index) => {
        const modifier = receipt.modifiers[index] ? receipt.modifiers[index] : '';
        return `\u2022 <b>${name}</b> ${modifier} [cal.${receipt.calories[index]}] [$${receipt.prices[index]}]`;
    }).join('<br /><br />');

    return `<br /><br />${receiptDetails}<br /><br />
            Total calories: ${calTotal}<br /><br />
            Subtotal: $${subtotal}<br />
            Tax: $${(subtotal * 0.0825).toFixed(2)}<br />
            Total: <b>$${(subtotal + subtotal * 0.0825).toFixed(2)}</b>`;
}

function checkIngredients(entities){

    var ingredients = []

    for(const element of entities){

        // console.log(element)
        if(element.entity === 'ingredients'){
            const ingredient = element.option
            // console.log(element)
            // console.log(ingredient)

            ingredients.push(ingredient)
        }
    }
    return ingredients
}

function checkModify(entities){

    for(const element of entities){
        if(element.entity === 'modify'){
            return element.option
        }
    }
    return
}

async function displayPartialMenu(entities, itemCollectionMap){
    // looking for what constitutes as an item (look at lines 37-48 in training.js)
    const itemEntity = entities.find(e => e.entity === 'item');
        
    if (!itemEntity) {
        return null;
    }

    const item = itemEntity.option; // pulling item type
    
    const collection = itemCollectionMap[item.toLowerCase()]

    if (!collection){
        return res.json({ reply: `We do not serve any ${item}s.`})
    }

    const items = await collection.find({}).exec(); // finds all documents for a specific item
    if (items.length === 0) {
        return res.json({ reply: `No ${item}s found.` });
    }
    
    // create array of item names and prices
    const itemNames = items.map(i => `\u2022 <b>${i.name}</b> [cal.${i.calories}] [$${i.price}]`).join('<br />');

    return `<br /><br />${itemNames}`;
}

async function displayGeneralMenu(sections){
    const head = sections.slice(0, -1).join(', ');
    const last = sections[sections.length - 1];
    return `${head}, and ${last}`;
}

async function displayIngredients(entities, itemCollectionMap){
    const optionEntity = entities.find(e => e.entity === 'add.to.order');
    
    if (optionEntity == undefined || optionEntity == null){
        return null
    } 

    const option = optionEntity.option;                              
    const sourceText = optionEntity.sourceText                            
    const collection = itemCollectionMap[option.toLowerCase()] 

    sourceText.replace(/[^\w\s]/gi, '') // remove punctuation and other special chars
    const item = await collection.findOne({ name: { $regex: new RegExp(`^${sourceText}$`, "i") } }).exec()

    if (item == null){
        return null;
    }

    const head = item.ingredients.slice(0, -1).join(', ');
    const last = item.ingredients[item.ingredients.length - 1];
    return `<b>${head},</b> & <b>${last}</b>`;
}

async function displayCalories(entities, itemCollectionMap) {
    const optionEntity = entities.find(e => e.entity === 'add.to.order');   

    if (optionEntity == undefined || optionEntity == null){
        return null
    } 

    const option = optionEntity.option;                              
    const sourceText = optionEntity.sourceText;                            
    const collection = itemCollectionMap[option.toLowerCase()];
    
    sourceText.replace(/[^\w\s]/gi, '') // remove punctuation and other special chars
    const item = await collection.findOne({ name: { $regex: new RegExp(`^${sourceText}$`, "i") } }).exec();

    return `<b>${item.calories}</b>`;
}

async function displayDescription(entities, itemCollectionMap){
    const optionEntity = entities.find(e => e.entity === 'add.to.order');   

    if (optionEntity == undefined || optionEntity == null){
        return null
    } 

    const option = optionEntity.option;                              
    const sourceText = optionEntity.sourceText                            
    const collection = itemCollectionMap[option.toLowerCase()] 

    sourceText.replace(/[^\w\s]/gi, '') // remove punctuation and other special chars
    const item = await collection.findOne({ name: { $regex: new RegExp(`^${sourceText}$`, "i") } }).exec();

    return `${item.description}<br /><br />`
}

async function updateOrder(entities, itemCollectionMap){
    // (used for searching mongodb documents)

    const switchIndex = entities.findIndex(e => e.entity === 'switch');
    // console.log(switchIndex)

    const optionEntityType = entities.find(e => e.entity === 'add.to.order');   
    const optionEntity = entities.filter(e => e.entity === 'add.to.order');   
    // console.log(optionEntity)

    if (optionEntity == undefined || optionEntity == null){
        return null
    } 

    if (switchIndex == 0){

        const option = optionEntityType.option;
        const collection = itemCollectionMap[option.toLowerCase()] 
    
        // creating array of item names (strings) based on each entity that nlp.js recognizes
        const itemNames = optionEntity.map(e => e.sourceText);
    
        // searching array above for item that user wants instead
        const item = await collection.findOne({ name: { $regex: new RegExp(`^${itemNames[1]}$`, "i") } }).exec();
        
        // seerching global array of current order item names for item that user wants to replace
        const index = names.indexOf(itemNames[0]);

        if (index < 0){
            return 'The item you want to replace is not in your cart currently. Let me know which item you\'d like to order!'
        }
        
        names[index] = item.name;
        calories[index] = item.calories;
        modifiers[index] = '';
        prices[index] = item.price;

    return `Replacing your ${itemNames[0]} with a ${itemNames[1]}`

    }
    else if (switchIndex == 1){

        const option = optionEntityType.option;                                                      
        const collection = itemCollectionMap[option.toLowerCase()] 
    
        const itemNames = optionEntity.map(e => e.sourceText);
        const item = await collection.findOne({ name: { $regex: new RegExp(`^${itemNames[0]}$`, "i") } }).exec();
        // console.log(item)
        
        const index = names.indexOf(itemNames[1]);
    
        if (index < 0){
            return 'The item you want to replace is not in your cart currently. Let me know which item you\'d like to order!'
        }
    
        names[index] = item.name;
        calories[index] = item.calories;
        modifiers[index] = '';
        prices[index] = item.price;
    
        return `Replacing your ${itemNames[1]} with a ${itemNames[0]}`

    }
    else
        return`Error finding switch index`

}

async function afterDecision(response, itemCollectionMap){
    
    const previousResponse = conversation[conversation.length - 2]
    const previousResponseIntent = previousResponse.intent



    if(previousResponseIntent === 'show.description' || previousResponseIntent === 'show.calories') 
        afterDecisionDescription(response, itemCollectionMap)
    else if(previousResponseIntent === 'recommend')
        afterDecisionRecommendation(response, itemCollectionMap)

}

async function giveRecommendation(entities, itemCollectionMap){
    const itemEntity = entities.find(e => e.entity === 'item')

    // console.log(itemEntity)

    if(itemEntity == undefined || itemEntity == null){
        return null
    }

    const option = itemEntity.option   
    const collection = itemCollectionMap[option.toLowerCase()]
    const items = await collection.find({ favorite: true }).exec();

    
    // console.log(items)

    if (items.length > 0) {
        const randomItem = items[Math.floor(Math.random() * items.length)];
        previousRecommendation = randomItem
        console.log(randomItem);
        return `<b>${randomItem.name}</b>`;
    } else {
        console.log("No items found with recommendation set to true.");
        // return 'Error finding item,  none in array, add some favorites to type';
        return null;
    }
    

}



async function afterDecisionDescription(response, itemCollectionMap){

    let collection = '';
    let orderDetails = '';
    let modify = '';
    let ingredients = []

    let tempNames = []
    let tempCalories = []
    let tempModifiers = []
    let tempPrices = []
    

    const previousResponse = conversation[conversation.length - 2]
    const previousResponseEntities = previousResponse.entities
    const previousOptionEntity = previousResponseEntities.find(e => e.entity === 'add.to.order');
    const previousOption = previousOptionEntity.option
    const previousSourceText = previousOptionEntity.sourceText

    // console.log(previousOptionEntity)

    if(previousOptionEntity.entity === 'add.to.order'){
        collection = itemCollectionMap[previousOption.toLowerCase()]              // matching item type to Mongoose schema (see item.js and server.js)
        // console.log(collection)                                           // Mongoose schema (i.e. { Pizza })

        previousSourceText.replace(/[^\w\s]/gi, '') // remove punctuation and other special chars
        item = await collection.findOne({ name: { $regex: new RegExp(`^${previousSourceText}$`, "i") } }).exec()

        if (!item)
            return res.json({ reply: `We do not serve a ${previousSourceText}.`})


        // push item info to order-related arrays
        names.push(item.name)
        calories.push(item.calories)
        prices.push(item.price)

        // push same info to temp arrays for items being **currently** ordered
        tempNames.push(item.name)
        tempCalories.push(item.calories)
        tempPrices.push(item.price)

        // console.log(names)

    }

    orderDetails = tempNames.map((name, index) => {
        const modifier = tempModifiers[index] ? tempModifiers[index] : '';

        if (tempNames.length == 1 || (index == tempNames.length - 2 && tempNames.length == 2))
            return `<b>${name}</b>${modifier}`

        if (index == tempNames.length - 1 && tempNames.length > 1) {
            return `and <b>${name}</b>${modifier}`;
        }

        return ` <b>${name}</b>${modifier},`
    }).join(' ');

    // if user didn't order anything found on menu, return null
    if (orderDetails == null || orderDetails == '')
        return null

    return orderDetails



}

async function afterDecisionRecommendation(response, itemCollectionMap){

    let collection = '';
    let orderDetails = '';
    let modify = '';
    let ingredients = []

    let tempNames = []
    let tempCalories = []
    let tempModifiers = []
    let tempPrices = []
    


    if (!previousRecommendation)
        return res.json({ reply: `We do not serve a ${previousRecommendation}.`})


    // push item info to order-related arrays
    names.push(previousRecommendation.name)
    calories.push(previousRecommendation.calories)
    prices.push(previousRecommendation.price)

    // push same info to temp arrays for items being **currently** ordered
    tempNames.push(previousRecommendation.name)
    tempCalories.push(previousRecommendation.calories)
    tempPrices.push(previousRecommendation.price)

    // console.log(names)
    orderDetails = tempNames.map((name, index) => {
        const modifier = tempModifiers[index] ? tempModifiers[index] : '';

        if (tempNames.length == 1 || (index == tempNames.length - 2 && tempNames.length == 2))
            return `<b>${name}</b>${modifier}`

        if (index == tempNames.length - 1 && tempNames.length > 1) {
            return `and <b>${name}</b>${modifier}`;
        }

        return ` <b>${name}</b>${modifier},`
    }).join(' ');

    // if user didn't order anything found on menu, return null
    if (orderDetails == null || orderDetails == '')
        return null

    return orderDetails

}

function setPreviousRecommendation(newValue){
    previousRecommendation = newValue
}

module.exports = {addToOrder, checkIngredients, checkModify, displayPartialMenu, placeOrder, removeFromOrder, 
                  displayGeneralMenu, displayIngredients, displayCalories, displayDescription, displayCurrentOrder, 
                  updateOrder, afterDecision, giveRecommendation, setPreviousRecommendation, conversation, previousRecommendation}