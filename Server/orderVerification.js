const { model } = require("mongoose");






async function checkOrder(response, itemCollectionMap){

    const entities = response.entities
    const optionEntity = entities.find(e => e.entity === 'order');
    const option = optionEntity.option;
    const sourceText = optionEntity.sourceText
    const collection = itemCollectionMap[option.toLowerCase()]
    // console.log(optionEntity)
    // console.log(option)
    // console.log(entities)

    if (!collection){
        return res.json({ reply: `We do not serve any ${item}s.`})
    }

    const items = await collection.find({}).exec()

        // console.log(items)
    
        //Searches through the inputs and determines if it matches a pizza in the database
        for (const element of items){
            const name = element.name
            const type = element.option

            // console.log(name)
            // console.log(entities)
            // console.log(type)
        
            if (name == sourceText){ 
                const ingredients = checkIngredients(entities)
                var modify = checkModify(entities)
                // console.log("Success")
                // console.log(element)
                
                if (modify == 'positive'){
                    modify = 'with'
                }
                else if(modify == 'negative'){
                    modify = 'without'
                }
                else{
                    modify = ''
                }
                var output = `Ordering a ${sourceText} ${option} ${modify} ${ingredients.join(', ')}`

                console.log(output)
                return output;
            }
        };

    
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

        const item = itemEntity.option;

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
    
        const itemNames = items.map(i => i.name).join(', ');


        return `Here are our ${item}s: ${itemNames}`
}


module.exports = {checkOrder, checkIngredients, checkModify, displayPartialMenu}