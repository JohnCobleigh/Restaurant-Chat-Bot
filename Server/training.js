const { modelNames } = require("mongoose");
const { 
    validPizzas, validPastas, validMargaritas, 
    ValidMartinis, validMocktails, validSalads, validSangrias, 
    validCocktails, validStarters, validDesserts 
} = require("./validOrders");

module.exports = (manager) => {
    /* *********************************************************************** */
    // Asking for general menu info

    // display both food and drink sections
    manager.addDocument('en', 'What is on the menu?', 'menu.ask');
    manager.addDocument('en', 'What items do you have?', 'menu.ask');
    manager.addDocument('en', 'What kind of items do you serve?', 'menu.ask');
    manager.addDocument('en', 'Show me the menu', 'menu.ask');
    manager.addDocument('en', 'Whats on the menu', 'menu.ask');
    manager.addDocument('en', 'Give me the menu', 'menu.ask');

    // Possible phrasings for listing general menu sections
    manager.addAnswer('en', 'menu.ask', 'For drinks, we serve *drink sections here*. And for food, we serve *food sections here*');
    manager.addAnswer('en', 'menu.ask', 'Our menu includes *food sections here* as well as *drink sections here*');

    // display only food sections
    manager.addDocument('en', 'What kind of food do you serve?', 'food.ask');
    manager.addDocument('en', 'What type of food do you have?', 'food.ask');
    manager.addDocument('en', 'What foods do you have?', 'food.ask');
    manager.addAnswer('en', 'food.ask', 'For food, we serve *food sections here*. Let me know you have any further questions.');
    manager.addAnswer('en', 'food.ask', 'Our kitchen makes both classic and original *food sections here*. You can ask me about any specifics!');

    // display only drink sections
    manager.addDocument('en', 'What kind of drinks do you serve?', 'drink.ask');
    manager.addDocument('en', 'What type of drinks do you have?', 'drink.ask');
    manager.addDocument('en', 'What drinks do you have?', 'drink.ask');
    manager.addAnswer('en', 'drink.ask', 'For drinks, we serve *drink sections here*. Let me know you have any further questions.');
    manager.addAnswer('en', 'drink.ask', 'Our bar makes *drink sections here*. You can ask me about any specifics!');
    /* *********************************************************************** */


    /* *********************************************************************** */
    // Asking for list of item names from a specified section
    manager.addDocument('en', 'Show me the %item%', 'item.show.all');
    manager.addDocument('en', 'What %item% choices do you have', 'item.show.all');
    manager.addDocument('en', 'List all the %item%', 'item.show.all');
    manager.addDocument('en', 'What %item% do you have', 'item.show.all');

    manager.addAnswer('en', 'item.show.all', 'Here are our %item%: *items here*');
    manager.addAnswer('en', 'item.show.all', 'For %item%, we serve: *items here*');
    manager.addAnswer('en', 'item.show.all', 'Our %item% include: *items here*');
    /* *********************************************************************** */ 


    /* *********************************************************************** */ 
    // Asking what ingredients a specified item has
    manager.addDocument('en', 'what does the %item% have', 'show.ingredients');
    manager.addDocument('en', 'what ingredients does the %item% have', 'show.ingredients');
    manager.addDocument('en', 'what is in the %item%', 'show.ingredients');

    manager.addAnswer('en', 'show.ingredients', 'Our %item% has: *ingredients here*');
    manager.addAnswer('en', 'show.ingredients', 'The %item% includes: *ingredients here*');
    /* *********************************************************************** */ 


    /* *********************************************************************** */ 
    // Asking for the description for a specified item
    manager.addDocument('en', 'Describe the %item% to me', 'show.description');
    manager.addDocument('en', 'Can you describe the %item%', 'show.description');
    manager.addDocument('en', 'Can you give me a description for the %item%', 'show.description');

    manager.addAnswer('en', 'show.description', '*description here* I can add this to your order if you\'d like.');
    manager.addAnswer('en', 'show.description', '*description here* Let me know if you want to order this.');
    /* *********************************************************************** */ 


    /* *********************************************************************** */ 
    // Asking how many calories a specified item has
    manager.addDocument('en', 'how many calories does the %item% have', 'show.calories');
    manager.addDocument('en', 'how many calories are in the %item%', 'show.calories');

    manager.addAnswer('en', 'show.calories', 'Our %item% has *calories here* calories.');
    manager.addAnswer('en', 'show.calories', 'There are *calories here* calories in the %item%.')
    /* *********************************************************************** */ 


    /* *********************************************************************** */
    // Adding an item to an order
    manager.addDocument('en', 'Give me %order% %modify% %ingredients%', 'add.to.order');
    manager.addDocument('en', 'i want a %order%, %modify% %ingredients%, %ingredients%, and %ingredients%', 'add.to.order');
    manager.addDocument('en', 'order me a %order% %modify% %ingredients% and %ingredients%', 'add.to.order');
    manager.addDocument('en', 'let me get a %order%', 'add.to.order');
    manager.addDocument('en', 'let me get a %order%, and %modify% %ingredients%', 'add.to.order');
    manager.addDocument('en', 'can you add a %order% %modify% %ingredient% to my order', 'add.to.order');
    manager.addDocument('en', 'can i get a %order%', 'add.to.order');
    manager.addDocument('en', 'can i order the %order%', 'add.to.order');

    manager.addAnswer('en', 'add.to.order', 'I\'ve added a %order% to your order. Can I get you anything else?');
    manager.addAnswer('en', 'add.to.order', 'A %order% has been added to your order. Anything else?');
    manager.addAnswer('en', 'add.to.order', 'Adding a %order% to your order. Let me know if there\'s anything else you would like.');
    /* *********************************************************************** */


    /* *********************************************************************** */
    // Removing an item from an order
    manager.addDocument('en', 'can i remove %order% from my order', 'remove.from.order');
    manager.addDocument('en', 'can i remove %order%', 'remove.from.order');
    manager.addDocument('en', 'i do not want %order% anymore', 'remove.from.order');
    manager.addDocument('en', 'remove %order%', 'remove.from.order');
    manager.addDocument('en', 'i changed my mind, i dont want %order%', 'remove.from.order');

    manager.addAnswer('en', 'remove.from.order', 'I\'ve removed a %order% from your order');
    manager.addAnswer('en', 'remove.from.order', 'A %order% has been removed from your order');
    manager.addAnswer('en', 'remove.from.order', 'Removing a %order% from your order');
    /* *********************************************************************** */


    /* *********************************************************************** */
    // Replacing/changing an item or ingredient in current order
    manager.addDocument('en', 'can i get a %item% instead of the %item%', 'update.order');

    manager.addAnswer('en', 'update.order', 'Replacing your *first item here* with the *second item here*');
    /* *********************************************************************** */


    /* *********************************************************************** */
    // Displaying current items in an order
    manager.addDocument('en', 'what is in my order', 'current.order');
    manager.addDocument('en', 'what\'s in my cart', 'current.order');
    manager.addDocument('en', 'what do i currently have', 'current.order');
    manager.addDocument('en', 'show me my order right now', 'current.order');
    manager.addDocument('en', 'show me my cart', 'current.order');

    manager.addAnswer('en', 'current.order', 'Here\'s what\'s currently in your order: *current order here* Let me know if you want to add anything else!');
    manager.addAnswer('en', 'current.order', 'Here\'s what you\'ve ordered so far: *current order here* You can still add any items you want.');
    manager.addAnswer('en', 'current.order', 'Your current order: *current order here* Let me know if I change anything for you.');
    /* *********************************************************************** */


    /* *********************************************************************** */
    //Giving the description of an item
    manager.addDocument('en', 'can you tell me about the %order%', 'describe.order')
    manager.addDocument('en', 'tell me about the %order%', 'describe.order')
    manager.addDocument('en', 'what is the %order%', 'describe.order')
    manager.addDocument('en', 'i want to know about the %order%', 'describe.order')
    manager.addDocument('en', 'ive never heard of %order% before, tell me about it', 'describe.order')
    manager.addDocument('en', 'decribe the %order% for me', 'describe.order')

    manager.addAnswer('en', 'describe.order', 'Of course, the %order% is *description here*')
    manager.addAnswer('en', 'describe.order','Our %order% is *description here*')

    /* *********************************************************************** */

    /* *********************************************************************** */
    // Checking out
    manager.addDocument('en', 'that is all i want to order', 'place.order');
    manager.addDocument('en', 'that will be it', 'place.order');
    manager.addDocument('en', 'i would like to checkout', 'place.order');
    manager.addDocument('en', 'let me checkout', 'place.order');
    manager.addDocument('en', 'thats everything', 'place.order');
    manager.addDocument('en', 'thats everything for me', 'place.order');

    // Possible phrasings to couple with receipt once user finalizes order
    manager.addAnswer('en', 'place.order', 'Here is what you ordered today: *receipt here*');
    manager.addAnswer('en', 'place.order', 'Here\'s your receipt: *receipt here*');
    manager.addAnswer('en', 'place.order', 'Your order has been placed: *receipt here*');
    /* *********************************************************************** */


    // Recognizing specified items in input and considering different spellings and synomyms 
    manager.addNamedEntityText('item', 'plate', ['en'], ['plate', 'plates', 'entree', 'entrees']);
    manager.addNamedEntityText('item', 'pizza', ['en'], ['pizza', 'pizzas', 'pie', 'pies']);
    manager.addNamedEntityText('item', 'pasta', ['en'], ['pasta', 'pastas']);
    manager.addNamedEntityText('item', 'salad', ['en'], ['salad', 'salads']);
    manager.addNamedEntityText('item', 'starter', ['en'], ['starter', 'starters', 'appetizer', 'appetizers', 'app', 'apps']);
    manager.addNamedEntityText('item', 'sangria', ['en'], ['sangria', 'sangrias']);
    manager.addNamedEntityText('item', 'mocktail', ['en'], ['mocktail', 'mocktails', 'no alcohol', 'non alcoholic']);
    manager.addNamedEntityText('item', 'cocktail', ['en'], ['cocktail', 'cocktails']);
    manager.addNamedEntityText('item', 'martini', ['en'], ['martini', 'martinis']);
    manager.addNamedEntityText('item', 'margarita', ['en'], ['margarita', 'margaritas']);
    manager.addNamedEntityText('item', 'dessert', ['en'], ['dessert', 'desserts', 'sweet treat', 'sweet treats']);
    manager.addNamedEntityText('item', 'pasta', ['en'], ['pasta', 'pastas']);
    
    manager.addNamedEntityText('add.to.order', 'pizza', ['en'], validPizzas);
    manager.addNamedEntityText('add.to.order', 'pasta', ['en'], validPastas);
    manager.addNamedEntityText('add.to.order', 'margarita', ['en'], validMargaritas);
    manager.addNamedEntityText('add.to.order', 'martini', ['en'], ValidMartinis);
    manager.addNamedEntityText('add.to.order', 'mocktail', ['en'], validMocktails);
    manager.addNamedEntityText('add.to.order', 'salad', ['en'], validSalads);
    manager.addNamedEntityText('add.to.order', 'sangria', ['en'], validSangrias);
    manager.addNamedEntityText('add.to.order', 'cocktail', ['en'], validCocktails);
    manager.addNamedEntityText('add.to.order', 'starter', ['en'], validStarters);
    manager.addNamedEntityText('add.to.order', 'dessert', ['en'], validDesserts);

    // used for identifying ingredients to be added or removed
    manager.addNamedEntityText('ingredients', 'olives', ['en'], ['olives', "olive's"]);
    manager.addNamedEntityText('ingredients', 'peppers', ['en'], ['peppers']);
    manager.addNamedEntityText('ingredients', 'pepperoni', ['en'], ['pepperonis', "pepperoni's", 'pepperoni']);
    manager.addNamedEntityText('ingredients', 'basil', ['en'], ['basil', 'fresh basil']);
    manager.addNamedEntityText('ingredients', 'jalapeno', ['en'], ['jalapenos']);
    manager.addNamedEntityText('ingredients', 'tomato', ['en'], ['tomato', "tomato's"]);

    // recognizes when user wants to add or remove ingredient from an item
    manager.addNamedEntityText('modify', 'positive', ['en'], ['add', 'extra', 'put some', 'with']);
    manager.addNamedEntityText('modify', 'negative', ['en'], ['take off', 'no', 'without']);
    
    manager.train().then(async() => {
        manager.save();
    });
};