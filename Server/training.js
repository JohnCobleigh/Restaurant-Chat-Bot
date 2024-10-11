const { 
    validPizzas, validPastas, validMargaritas, 
    ValidMartinis, validMocktails, validSalads, validSangrias, 
    validCocktails, validStarters, validDesserts 
} = require("./validOrders");

module.exports = (manager) => {

    /* *********************************************************************** */
    // Asking for general menu info
    manager.addDocument('en', 'What is on the menu?', 'menu.ask');
    manager.addDocument('en', 'What items do you have?', 'menu.ask');
    manager.addDocument('en', 'What kind of items do you serve?', 'menu.ask');
    manager.addDocument('en', 'Show me the menu', 'menu.ask');
    manager.addDocument('en', 'Whats on the menu', 'menu.ask');
    manager.addDocument('en', 'Give me the menu', 'menu.ask');

    // Possible phrasings for listing general menu sections
    manager.addAnswer('en', 'menu.ask', 'For drinks, we serve *drink sections here*. And for food, we serve *food sections here*');
    manager.addAnswer('en', 'menu.ask', 'Our menu includes *food sections here* as well as *drink sections here*');
    /* *********************************************************************** */


    /* *********************************************************************** */
    // Asking for list of item names from a specified section
    manager.addDocument('en', 'Show me the %item%', 'item.show.all')
    manager.addDocument('en', 'What %item% choices do you have', 'item.show.all')
    manager.addDocument('en', 'List all the %item%', 'item.show.all')
    manager.addDocument('en', 'What %item% do you have', 'item.show.all')

    manager.addAnswer('en', 'item.show.all', 'Here are our %item%: *items here*')
    manager.addAnswer('en', 'item.show.all', 'For %item%, we serve: *items here*')
    manager.addAnswer('en', 'item.show.all', 'Our %item% include: *items here*')
    /* *********************************************************************** */ 


    /* *********************************************************************** */ 
    // Asking what ingredients a specified item has
    manager.addDocument('en', 'what does the %item% have', 'show.ingredients')
    manager.addDocument('en', 'what ingredients does the %item% have', 'show.ingredients')
    manager.addDocument('en', 'what is in the %item%', 'show.ingredients')

    manager.addAnswer('en', 'show.ingredients', 'Our %item% has: *ingredients here*')
    manager.addAnswer('en', 'show.ingredients', 'The %item% includes: *ingredients here*')
    /* *********************************************************************** */ 


    /* *********************************************************************** */
    // Adding an item to an order
    manager.addDocument('en', 'Give me %order% %modify% %ingredients%', 'add.to.order');
    manager.addDocument('en', 'i want a %order%, %modify% %ingredients%, %ingredients%, and %ingredients%', 'add.to.order');
    manager.addDocument('en', 'order me a %order% %modify% %ingredients% and %ingredients%', 'add.to.order');
    manager.addDocument('en', 'let me get a %order%, and %modify% %ingredients% on it', 'add.to.order');
    manager.addDocument('en', 'can you add a %order% %modify% %ingredient% to my order', 'add.to.order');
    manager.addDocument('en', 'can i get a %order%', 'add.to.order');
    manager.addDocument('en', 'can i order the %order%', 'add.to.order');

    manager.addAnswer('en', 'add.to.order', 'I\'ve added a %order% to your order')
    manager.addAnswer('en', 'add.to.order', 'A %order% has been added to your order')
    manager.addAnswer('en', 'add.to.order', 'Adding a %order% to your order')
    /* *********************************************************************** */


    /* *********************************************************************** */
    // Removing an item from an order
    manager.addDocument('en', 'can i remove %order% from my order', 'remove.from.order');
    manager.addDocument('en', 'i do not want %order% anymore', 'remove.from.order');
    manager.addDocument('en', 'remove %order%', 'remove.from.order');

    manager.addAnswer('en', 'remove.from.order', 'I\'ve removed a %order% from your order')
    manager.addAnswer('en', 'remove.from.order', 'A %order% has been removed from your order')
    manager.addAnswer('en', 'remove.from.order', 'Removing a %order% from your order')
    /* *********************************************************************** */


    /* *********************************************************************** */
    // Checking out
    manager.addDocument('en', 'that is all i want to order', 'place.order');
    manager.addDocument('en', 'that will be it', 'place.order');
    manager.addDocument('en', 'i would like to checkout', 'place.order');
    manager.addDocument('en', 'let me checkout', 'place.order');

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
    manager.addNamedEntityText('ingredients', 'japalenio', ['en'], ['japalenio', "japalenio's", 'japalenios']);
    manager.addNamedEntityText('ingredients', 'tomato', ['en'], ['tomato', "tomato's"]);

    // recognizes when user wants to add or remove ingredient from an item
    manager.addNamedEntityText('modify', 'positive', ['en'], ['add', 'extra', 'put some', 'with']);
    manager.addNamedEntityText('modify', 'negative', ['en'], ['remove', 'take off', 'no', 'without']);
    
    manager.train().then(async() => {
        manager.save();
    });
};



/*
Todo
add removing of orderVerification
add storing order
add  removing ingredients from order
add displaying more information on request
add discriptions if asking for it
find a way to run funcions in the answer area
let nlp find items without item type

*/