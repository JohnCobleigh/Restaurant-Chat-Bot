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


    manager.addAnswer('en', 'menu.ask', 'For drinks, we serve *drink sections here*. And for food, we serve *food sections here*');
    manager.addAnswer('en', 'menu.ask', 'Our menu includes *food sections here* as well as *drink sections here*');
    /* *********************************************************************** */


    /* *********************************************************************** */
    // display only food sections
    manager.addDocument('en', 'What kind of food do you serve?', 'food.ask');
    manager.addDocument('en', 'What type of food do you have?', 'food.ask');
    manager.addDocument('en', 'What foods do you have?', 'food.ask');

    manager.addAnswer('en', 'food.ask', 'For food, we serve *food sections here*. Let me know you have any further questions.');
    manager.addAnswer('en', 'food.ask', 'Our kitchen makes both classic and original *food sections here*. You can ask me about any specifics!');
    /* *********************************************************************** */


    /* *********************************************************************** */
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
    manager.addDocument('en', 'can you tell me what %item% you serve', 'item.show.all');

    manager.addAnswer('en', 'item.show.all', 'Here are our %item%s: *items here*');
    manager.addAnswer('en', 'item.show.all', 'For %item%s, we serve: *items here*');
    manager.addAnswer('en', 'item.show.all', 'Our %item%s include: *items here*');
    /* *********************************************************************** */ 


    /* *********************************************************************** */ 
    // Asking what ingredients a specified item has
    manager.addDocument('en', 'what does the %item% have', 'show.ingredients');
    manager.addDocument('en', 'what ingredients does the %item% have', 'show.ingredients');
    manager.addDocument('en', 'what is in the %item%', 'show.ingredients');
    manager.addDocument('en', 'whats on the %item%', 'show.ingredients');
    manager.addDocument('en', 'what\'s on the %item%', 'show.ingredients');

    manager.addAnswer('en', 'show.ingredients', 'Our %item% has: *info here*');
    manager.addAnswer('en', 'show.ingredients', 'The %item% includes: *info here*');
    /* *********************************************************************** */ 


    /* *********************************************************************** */ 
    // Asking for the description for a specified item
    manager.addDocument('en', 'Describe the %item% to me', 'show.description');
    manager.addDocument('en', 'Can you describe the %item%', 'show.description');
    manager.addDocument('en', 'Can you give me a description for the %item%', 'show.description');
    manager.addDocument('en', 'tell me about the %item%', 'show.description');
    manager.addDocument('en', 'Can you tell me about the %item%', 'show.description');
    manager.addDocument('en', '%item%', 'show.description');
    manager.addDocument('en', 'Can you tell me about the %order%', 'show.description');

    manager.addAnswer('en', 'show.description', '*info here* I can add this to your order if you\'d like!');
    manager.addAnswer('en', 'show.description', '*info here* Let me know if you want to order this!');
    /* *********************************************************************** */ 


    /* *********************************************************************** */ 
    // Asking how many calories a specified item has
    manager.addDocument('en', 'how many calories does the %item% have', 'show.calories');
    manager.addDocument('en', 'how many calories are in the %item%', 'show.calories');
    manager.addDocument('en', 'can you tell me how many calories the %item% has', 'show.calories');

    manager.addAnswer('en', 'show.calories', 'Our %item% has *info here* calories.');
    manager.addAnswer('en', 'show.calories', 'There are *info here* calories in the %item%.')
    /* *********************************************************************** */ 


    /* *********************************************************************** */ 
    // Asking how much an item cost
    manager.addDocument('en', 'how much does the %item% cost', 'show.price');
    manager.addDocument('en', 'how expensive is the %item%%', 'show.price');

    manager.addAnswer('en', 'show.price', 'Our %item% is *info here*.');
    manager.addAnswer('en', 'show.price', 'The %item% costs *info here*.')
    /* *********************************************************************** */ 

    
    /* *********************************************************************** */ 
    // Asking for recommendations
    manager.addDocument('en', 'what %item% would you recommend', 'recommend');
    manager.addDocument('en', 'can you give me some %item% recommendations', 'recommend');
    manager.addDocument('en', 'what is your favorite %item%', 'recommend');
    manager.addDocument('en', 'what %item% should i order', 'recommend');

    manager.addAnswer('en', 'recommend', 'I would recommend you order the *recommendation*');
    manager.addAnswer('en', 'recommend', 'You should get the *recommendation*')
    manager.addAnswer('en', 'recommend', 'I think you would like the *recommendation*')
    /* *********************************************************************** */ 


    /* *********************************************************************** */
    // Adding an item to an order
    manager.addDocument('en', 'Give me %order% %modify% %ingredients%', 'add.to.order');
    manager.addDocument('en', 'i want a %order%, %modify% %ingredients%, %ingredients%, and %ingredients%', 'add.to.order');
    manager.addDocument('en', 'order me a %order% %modify% %ingredients% and %ingredients%', 'add.to.order');
    manager.addDocument('en', 'let me get a %order%', 'add.to.order');
    manager.addDocument('en', 'let me get the %order%', 'add.to.order');
    manager.addDocument('en', 'let me get a %order% and %order%', 'add.to.order');
    manager.addDocument('en', 'let me get a %order%, and %modify% %ingredients%', 'add.to.order');
    manager.addDocument('en', 'can you add a %order% %modify% %ingredient% to my order', 'add.to.order');
    manager.addDocument('en', 'can i get a %order%', 'add.to.order');
    manager.addDocument('en', 'can i get a %order% and %order%', 'add.to.order');
    manager.addDocument('en', 'can i order the %order%', 'add.to.order');
    manager.addDocument('en', 'can i order a %order% %item%', 'add.to.order');
    manager.addDocument('en', 'add a %order% to my order', 'add.to.order');
    manager.addDocument('en', 'can i get a %order% %item%', 'add.to.order');
    manager.addDocument('en', 'can i order %number% %order%', 'add.to.order');

    manager.addAnswer('en', 'add.to.order', 'I\'ve added %order% to your order. Can I get you anything else?');
    manager.addAnswer('en', 'add.to.order', '%order% has been added to your order. Anything else?');
    manager.addAnswer('en', 'add.to.order', 'Adding %order% to your order. Let me know if there\'s anything else you would like.');
    /* *********************************************************************** */


    /* *********************************************************************** */
    // Removing an item from an order
    manager.addDocument('en', 'can i remove %order% from my order', 'remove.from.order');
    manager.addDocument('en', 'can i remove %order%', 'remove.from.order');
    manager.addDocument('en', 'i do not want %order% anymore', 'remove.from.order');
    manager.addDocument('en', 'remove %order%', 'remove.from.order');
    manager.addDocument('en', 'i changed my mind, i dont want %order%', 'remove.from.order');
    manager.addDocument('en', 'take the %order% off my order', 'remove.from.order');
    manager.addDocument('en', 'remove the %order% from my order', 'remove.from.order');
    manager.addDocument('en', 'take off the %order% from my order', 'remove.from.order');

    manager.addAnswer('en', 'remove.from.order', 'I\'ve removed a %order% from your order');
    manager.addAnswer('en', 'remove.from.order', 'A %order% has been removed from your order');
    manager.addAnswer('en', 'remove.from.order', 'Removing a %order% from your order');
    manager.addAnswer('en', 'remove.from.order', 'The %order% has been removed from your order');
    /* *********************************************************************** */


    /* *********************************************************************** */
    // Replacing/changing an item or ingredient in current order
    manager.addDocument('en', 'can i get a %item% %switch% the %item%', 'update.order');
    manager.addDocument('en', 'can i %switch% the %item% for the %item%', 'update.order');
    manager.addDocument('en', 'can i %switch% the %item% with a %item%', 'update.order');
    manager.addDocument('en', 'would it be okay to %switch% the %item% to a %item%', 'update.order');
    manager.addDocument('en', 'could you %switch% the %item% to a %item%', 'update.order');
    manager.addDocument('en', 'i’d prefer a %item% %switch% the %item%, can you make that change', 'update.order')
    

    manager.addAnswer('en', 'update.order', 'Replacing your *first item here* with the *second item here*');
    manager.addAnswer('en', 'update.order', 'I\'ve replaced your *first item here* with the *second item here*');
    manager.addAnswer('en', 'update.order', 'I\'ve removed the *second item here* from your order and replaced it with the *first item here*');
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
    // Clear the whole cart
    manager.addDocument('en', 'can you clear my curent order', 'clear.order');
    manager.addDocument('en', 'can you empty my cart', 'clear.order');
    manager.addDocument('en', 'can you clear my cart', 'clear.order');
    manager.addDocument('en', 'remove everything in my cart please', 'clear.order');
    manager.addDocument('en', 'clear my order', 'clear.order');
    manager.addDocument('en', 'empty my cart', 'clear.order');
    
    manager.addAnswer('en', 'clear.order', 'I\'ve emptied your cart');
    /* *********************************************************************** */
    




    /* *********************************************************************** */
    // Checking out
    manager.addDocument('en', 'that is all i want to order', 'place.order');
    manager.addDocument('en', 'that will be it', 'place.order');
    manager.addDocument('en', 'i would like to checkout', 'place.order');
    manager.addDocument('en', 'let me checkout', 'place.order');
    manager.addDocument('en', 'thats everything', 'place.order');
    manager.addDocument('en', 'thats everything for me', 'place.order');

    manager.addAnswer('en', 'place.order', 'Here is what you ordered today: *receipt here*');
    manager.addAnswer('en', 'place.order', 'Here\'s your receipt: *receipt here*');
    manager.addAnswer('en', 'place.order', 'Your order has been placed: *receipt here*');
    /* *********************************************************************** */



    manager.addDocument('en', 'yes', 'answer.yes');
    manager.addDocument('en', 'yeah', 'answer.yes')
    manager.addDocument('en', 'yea', 'answer.yes')
    manager.addDocument('en', 'sure', 'answer.yes')
    manager.addDocument('en', 'ok', 'answer.yes')
    manager.addDocument('en', 'uh-huh', 'answer.yes')
    manager.addDocument('en', 'uh huh', 'answer.yes')
    manager.addDocument('en', 'i do', 'answer.yes')

    manager.addAnswer('en', 'answer.yes', 'ok yes')



    manager.addDocument('en', 'no', 'answer.no')
    manager.addDocument('en', 'nah', 'answer.no')
    manager.addDocument('en', 'nope', 'answer.no')
    manager.addDocument('en', 'i dont', 'answer.no')

    manager.addAnswer('en', 'answer.no', 'ok no')


    
    manager.addDocument('en', 'can i get that', 'answer.order.that')
    manager.addDocument('en', 'can i order that', 'answer.order.that')
    manager.addDocument('en', 'i want that', 'answer.order.that')
    manager.addDocument('en', 'get that for me', 'answer.order.that')
    manager.addDocument('en', 'add that to my order', 'answer.order.that')
    // manager.addDocument('en', 'can i order that %modify% %ingredients%', 'answer.order.that')

    manager.addAnswer('en', 'answer.order.that', 'Sure! I\'ve just added it to your order.')



    // Recognizing specified items in input and considering different spellings and synomyms
    //Food types
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
    
    //Types of items in each category
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

    //Ingredient types
    manager.addNamedEntityText('ingredients', 'olives', ['en'], ['olives', "olive's"]);
    manager.addNamedEntityText('ingredients', 'peppers', ['en'], ['peppers']);
    manager.addNamedEntityText('ingredients', 'pepperoni', ['en'], ['pepperonis', "pepperoni's", 'pepperoni']);
    manager.addNamedEntityText('ingredients', 'basil', ['en'], ['basil', 'fresh basil']);
    manager.addNamedEntityText('ingredients', 'jalapeno', ['en'], ['jalapenos']);
    manager.addNamedEntityText('ingredients', 'tomato', ['en'], ['tomato', "tomato's"]);

    //Recognizes when user wants to add or remove ingredient from an item
    manager.addNamedEntityText('modify', 'positive', ['en'], ['add', 'extra', 'put some', 'with']);
    manager.addNamedEntityText('modify', 'negative', ['en'], ['take off', 'no', 'without']);

    //Needed to find out what item you want to replace and what item to replace it with
    manager.addNamedEntityText('switch', 'replace', ['en'], ['replace', 'instead of', 'change', 'substitute', 'swap'])

    //manager.addNamedEntityText('digit', 'one', ['en'], ['a', 'the'])




    //Saves the training data, allowing the bot to respond consistently across different chats (I believe)
    manager.train().then(async() => {
        manager.save();
    });
};