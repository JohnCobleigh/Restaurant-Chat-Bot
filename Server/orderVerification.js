const { model } = require("mongoose");
const { Order } = require('./models/order.js')

let order = []
let calories = []
let modifiers = []
let prices = []

async function checkOrder(response, itemCollectionMap){

    const entities = response.entities
    const optionEntity = entities.find(e => e.entity === 'order'); // looking for what items are valid to order (see training.js and validOrders.js)
    const option = optionEntity.option;                            // pulling item type from optionEntity object
    const sourceText = optionEntity.sourceText                     // pulling specific name from optionEntity object
    const collection = itemCollectionMap[option.toLowerCase()]     // matching item type to Mongoose schema (see item.js and server.js)

    // (debugging stuff)
    console.log(entities)
    console.log(optionEntity)
    console.log(option)         // item type (i.e. pizza, pasta, etc.)
    console.log(sourceText)     // item name (i.e Thai Chicken)
    console.log(collection)     // Mongoose schema (i.e. { Pizza })

    // code below does NOT allow user to leave out item type in order prompt
    // ex. "can i order a Thai Chicken" breaks server but works properly if commented out

    // checking if the item type in user input exists in overall menu
    /*const itemEntity = entities.find(e => e.entity === 'item');
    const item = itemEntity.option;
    if (!collection){
        return res.json({ reply: `We do not serve any ${item}s.`})
    }*/

    // search for specific food or drink in collection
    const plate = await collection.findOne({ name: { $regex: new RegExp(`^${sourceText}$`, "i") } }).exec()

    if (!plate)
        return res.json({ reply: `We do not serve a ${sourceText}.`})

    // looking for ingredients to add/remove from food
    const ingredients = checkIngredients(entities)
    var modify = checkModify(entities)
            
    if (modify == 'positive'){
        modify = 'with'
    }
    else if(modify == 'negative'){
        modify = 'without'
    }
    else{
        modify = ''
    }

    var output = `Ordering a ${sourceText} ${modify} ${ingredients.join(', ')}`

    // order schema info
    order.push(plate.name)
    calories.push(plate.calories)
    modifiers.push(modify.concat(" ", ingredients))
    prices.push(plate.price)

    console.log(order)

    console.log(output)
    return output;
}

async function checkout(){
    // created new document to store in MongoDB using Mongoose schema
    const receipt = new Order({names: order, calories: calories, modifiers: modifiers, prices: prices})
    await receipt.save();

    let calTotal = calories.reduce((partialSum, a) => partialSum + a, 0);
    let subtotal = prices.reduce((partialSum, a) => partialSum + a, 0);

    // reset order-related arrays
    order.length = 0;
    calories.length = 0;
    modifiers.length = 0;
    prices.length = 0;  

    const receiptDetails = receipt.names.map((name, index) => {
        return `\u2022 ${name} ${receipt.modifiers[index]} [cal.${receipt.calories[index]}] [$${receipt.prices[index]}]`;
    }).join('<br><br>');

    return `<br><br>${receiptDetails}<br><br>
            Total calories: ${calTotal}<br><br>
            Subtotal: $${subtotal}<br>
            Tax: $${(subtotal * 0.0825).toFixed(2)}<br>
            Total: $${(subtotal + subtotal * 0.0825).toFixed(2)}`;
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
        return res.json({ reply: "Sorry, I couldn't understand which item you're looking for." });
    }

    const item = itemEntity.option; // pulling item type

    // matching item recognized in input to schema imported from item.js
    const collection = itemCollectionMap[item.toLowerCase()]

    //Looks to see if the collection exists in the database
    if (!collection){
        return res.json({ reply: `We do not serve any ${item}s.`})
    }

    const items = await collection.find({}).exec(); // finds all documents for a specific item
    
    //Checks to see if the database has items in the collection
    if (items.length === 0) {
        return res.json({ reply: `No ${item}s found.` });
    }
    
    // create array of item names and prices
    //const itemNames = items.map(i => i.name).join(', ');
    const itemNames = items.map(i => `\u2022 ${i.name} [cal.${i.calories}] [$${i.price}]`).join('<br><br>');

    return `Here are our ${item}s: <br><br> ${itemNames}`
}


module.exports = {checkOrder, checkIngredients, checkModify, displayPartialMenu, checkout}