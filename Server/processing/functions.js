const { IoPizzaSharp } = require('react-icons/io5');
const { MainPlate, Margarita, Martini, Mocktail, Pasta, Pizza, Salad, Sangria, Cocktail, Starter, Dessert } = require('../models/item.js')
const { Order } = require('../models/order.js');

const itemCollectionMap = {
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

// store overall current order
let names = []
let calories = []
let modifiers = []
let prices = []
let quantities = []

let conversation = []

var previousRecommendation = null
var orderConfirmation = false

async function addToOrder(entities){
    let collection = '';
    let orderDetails = '';
    let modify = '';
    let ingredients = [];

    // used to store items that are being ordered in **current** input (global arrays seen above are overall order)
    // mostly just used for displaying/confirming that the items in current input were added to the cart
    let tempNames = []
    let tempTypes = []
    let tempCalories = []
    let tempModifiers = []
    let tempPrices = []
    let tempQuantities = []

    // loop through array of entities that we trained nlp.js to recognize 
    // entities in array are returned in a specific order (['add.to.order' -> 'modify' -> 'ingredients'] -> 'number')
    for (let e of entities){
        console.log(e);
        const option = e.option;                // pulling item type from optionEntity object (ex. pizza, pasta, mocktail)
        const sourceText = e.sourceText         // pulling specific name from optionEntity object (ex. carne asada, pacific thyme)

        let item = ''
        
        // handles any 'add.to.order' entities, each of which contains the specific name
        if (e.entity == 'add.to.order'){
            tempTypes.push(option)

            // search for specific food or drink in collection
            collection = itemCollectionMap[option.toLowerCase()]                                                // matching item type to Mongoose schema/MongoDB collection (see item.js and server.js)
            sourceText.replace(/[^\w\s]/gi, '')                                                                 // remove punctuation and other special chars
            item = await collection.findOne({ name: { $regex: new RegExp(`^${sourceText}$`, "i") } }).exec()    // grabbing the MongoDB document

            if (!item)
                return res.json({ reply: `We do not serve a ${sourceText}.`})


            // push item info to (global) order-related arrays using MongoDB document
            names.push(item.name)
            calories.push(item.calories)
            prices.push(item.price)

            // push same info to temp arrays for items being **currently** ordered
            tempNames.push(item.name)
            tempCalories.push(item.calories)
            tempPrices.push(item.price)
            tempModifiers.push('')      // push empty string as default
            tempQuantities.push(1)      // push quantity of 1 as default

            continue;
        }

        // handles any 'modify' entities (look towards end of training.js)
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

        // handles any 'ingredients' entities (above 'modify' entites in training.js)
        if (e.entity == 'ingredients'){
            ingredients.push(option)

            // since the 'modify' & 'ingredients' entities are returned consecutively after each 'add.to.order' entity
            // immediately concat the two strings & assign it to current index of tempModifiers (i.e. current item that is being added)
            let fullModify = modify.concat(" ", ingredients) 
            tempModifiers[tempModifiers.length - 1] = fullModify

            modify = '';
            ingredients = [];
            continue;
        }

        // 'number' entities always appear last in nlp.js array (automatically recognized, no training needed)
        // 'number' entities will appear in the same order as they appear in input (ex. two hawaiian, 1 thai chicken, and 4 pacific thymes --> 2, 1, 4)
        // so just assign them one by one in tempQuantities array (all quantities were set to 1 beforehand in 'add.to.order' if-statement)
        let index = 0
        for (let en of entities){
            if (en.entity === 'number'){
                let quantity = en.resolution.value;
                if (index < tempQuantities.length){
                    tempQuantities[index] = quantity
                    index++
                }
            }
        }
    }
    
    // push each quantity value & modify+ingredient string into overall order arrays
    for (let q of tempQuantities)
        quantities.push(q)
    for (let m of tempModifiers)
        modifiers.push(m)

    // formatting output
    orderDetails = tempNames.map((name, index) => {
        const modifier = tempModifiers[index] ? tempModifiers[index] : '';

        if (tempNames.length == 1 || (index == tempNames.length - 2 && tempNames.length == 2))
            return `${tempQuantities[index]}x <b>${name}</b> ${tempTypes[index]} ${modifier}`

        if (index == tempNames.length - 1 && tempNames.length > 1) {
            return `and ${tempQuantities[index]}x <b>${name}</b> ${tempTypes[index]} ${modifier}`;
        }

        return ` ${tempQuantities[index]}x <b>${name}</b> ${tempTypes[index]} ${modifier},`
    }).join(' ');

    // if user didn't order anything found on menu, return null
    if (orderDetails == null || orderDetails == '')
        return null

    // debugging
    console.log(names)
    console.log(calories)
    console.log(modifiers)
    console.log(prices)
    console.log(quantities)

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

            //console.log(names)
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
        return `\u2022 ${quantities[index]}x <b>${name}</b> ${modifier} [cal.${calories[index]}] [$${prices[index]}]`
    }).join('<br /><br />');

    let calTotal = calories.map((cal, index) => cal * quantities[index]).reduce((partialSum, a) => partialSum + a, 0);
    let subtotal = prices.map((price, index) => price * quantities[index]).reduce((partialSum, a) => partialSum + a, 0);


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

    if(orderConfirmation == false){
        orderConfirmation = true
        
        return 'Are you sure?'
    }

    // created new document to store in MongoDB using Mongoose schema
    const receipt = new Order({names: names, calories: calories, modifiers: modifiers, prices: prices})
    await receipt.save();

    let calTotal = calories.map((cal, index) => cal * quantities[index]).reduce((partialSum, a) => partialSum + a, 0);
    let subtotal = prices.map((price, index) => price * quantities[index]).reduce((partialSum, a) => partialSum + a, 0);

    // reset order-related arrays
    names.length = 0;
    calories.length = 0;
    modifiers.length = 0;
    prices.length = 0;  

    const receiptDetails = receipt.names.map((name, index) => {
        const modifier = receipt.modifiers[index] ? receipt.modifiers[index] : '';
        return `\u2022 ${quantities[index]}x <b>${name}</b> ${modifier} [cal.${receipt.calories[index]}] [$${receipt.prices[index]}]`;
    }).join('<br /><br />');

    orderConfirmation = false

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

async function displayPartialMenu(entities){
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

async function displaySpecificInfo(entities, intent) {
    const optionEntity = entities.find(e => e.entity === 'add.to.order');   

    if (optionEntity == undefined || optionEntity == null){
        return null
    } 

    const option = optionEntity.option;                              
    const sourceText = optionEntity.sourceText                            
    const collection = itemCollectionMap[option.toLowerCase()] 

    sourceText.replace(/[^\w\s]/gi, '') // remove punctuation and other special chars
    const item = await collection.findOne({ name: { $regex: new RegExp(`^${sourceText}$`, "i") } }).exec();

    if (intent == 'show.description')
        return `${item.description}<br /><br />`;

    else if (intent == 'show.calories')
        return `<b>${item.calories}</b>`;

    else if (intent == 'show.price')
        return `<b>$${item.price}</b>`;

    else if (intent == 'show.ingredients'){
        const head = item.ingredients.slice(0, -1).join(', ');
        const last = item.ingredients[item.ingredients.length - 1];
        return `<b>${head},</b> & <b>${last}</b>`;
    } 

    return null
}

async function updateOrder(entities){
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

async function afterDecision(response){
    
    const previousResponse = conversation[conversation.length - 2]
    console.log(previousResponse, " ", response)
    const previousResponseIntent = previousResponse.intent

    if(previousResponseIntent === 'show.description' || previousResponseIntent === 'show.calories' || previousResponseIntent === 'show.ingredients' || previousResponseIntent === 'show.price') 
        afterDecisionDescription(response)
    else if(previousResponseIntent === 'recommend')
        afterDecisionRecommendation(response)
    else if(previousResponseIntent === 'place.order')
        placeOrder()
}

async function giveRecommendation(entities){
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
        var randomItem = null
        if(previousRecommendation){
            do{
                randomItem = items[Math.floor(Math.random() * items.length)];
                console.log(previousRecommendation.name, " ", randomItem.name)
            }while(previousRecommendation.name === randomItem.name)

            previousRecommendation = randomItem
            //console.log(randomItem);
            return `<b>${randomItem.name}</b>`;
        } else {
            randomItem = items[Math.floor(Math.random() * items.length)];
            previousRecommendation = randomItem
            return `<b>${randomItem.name}</b>`;
        }
    } else {
        //console.log("No items found with recommendation set to true.");
        // return 'Error finding item,  none in array, add some favorites to type';
        return null;
    }
}

async function clearOrder(){
    names = []
    calories = []
    modifiers = []
    prices = []
}

async function afterDecisionDescription(response){

    const previousResponse = conversation[conversation.length - 2]
    const previousResponseEntities = previousResponse.entities

    addToOrder(previousResponseEntities)
}

async function afterDecisionRecommendation(response){
    let orderDetails = '';

    if (!previousRecommendation)
        return null

    // push item info to order-related arrays
    names.push(previousRecommendation.name)
    calories.push(previousRecommendation.calories)
    prices.push(previousRecommendation.price)
    modifiers.push(" ")     // still need to push empty modifier/ingredient to keep arrays for overall order aligned properly 
    quantities.push(1)

    // console.log(names)
    orderDetails = ` <b>${previousRecommendation.name}</b>`

    return orderDetails
}

function setPreviousRecommendation(newValue){
    previousRecommendation = newValue
}

function setOrderConfirmation(value){
    orderConfirmnation = value
}

function getOrderConfirmation(){
    return orderConfirmation
}

module.exports = {addToOrder, checkIngredients, checkModify, displayPartialMenu, placeOrder, removeFromOrder, 
                  displayGeneralMenu, displayCurrentOrder, updateOrder, afterDecision, giveRecommendation, 
                  setPreviousRecommendation, clearOrder, setOrderConfirmation, getOrderConfirmation,
                  conversation, previousRecommendation, displaySpecificInfo}