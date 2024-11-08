const { 
    validPizzas, validPastas, validMargaritas, 
    ValidMartinis, validMocktails, validSalads, validSangrias, 
    validCocktails, validStarters, validDesserts, validEntrees 
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
    manager.addDocument('en', 'What do you serve here', 'menu.ask');


    manager.addAnswer('en', 'menu.ask', 'For drinks, we serve cocktails, mocktails, margaritas, martinis, & sangrias. And, we have starters, salads, pizzas, pastas, other entrees, & desserts for food.');
    manager.addAnswer('en', 'menu.ask', 'Our menu includes starters, salads, pizzas, pastas, entrees, & desserts as well as cocktails, mocktails, margaritas, martinis, & sangrias');
    /* *********************************************************************** */


    /* *********************************************************************** */
    // display only food sections
    manager.addDocument('en', 'What kind of food do you serve?', 'food.ask');
    manager.addDocument('en', 'What type of food do you have?', 'food.ask');
    manager.addDocument('en', 'What foods do you have?', 'food.ask');

    manager.addAnswer('en', 'food.ask', 'For food, we serve starters, salads, pizzas, pastas, other entrees, & desserts. ... Let me know you have any further questions.');
    manager.addAnswer('en', 'food.ask', 'Our kitchen makes both classic & original starters, salads, pizzas, pastas, entrees, & desserts. ... You can ask me about any specifics!');
    /* *********************************************************************** */


    /* *********************************************************************** */
    // display only drink sections
    manager.addDocument('en', 'What kind of drinks do you serve?', 'drink.ask');
    manager.addDocument('en', 'What type of drinks do you have?', 'drink.ask');
    manager.addDocument('en', 'What drinks do you have?', 'drink.ask');

    manager.addAnswer('en', 'drink.ask', 'For drinks, we serve cocktails, mocktails, margaritas, martinis, & sangrias. ... Let me know you have any further questions.');
    manager.addAnswer('en', 'drink.ask', 'Our bar makes cocktails, mocktails, margaritas, martinis, & sangrias. ... You can ask me about any specifics!');
    /* *********************************************************************** */


    /* *********************************************************************** */
    // Asking for list of item names from a specified section
    manager.addDocument('en', 'Show me the %item%', 'item.show.all');
    manager.addDocument('en', 'What %item% choices do you have', 'item.show.all');
    manager.addDocument('en', 'List all the %item%', 'item.show.all');
    manager.addDocument('en', 'What %item% do you have', 'item.show.all');
    manager.addDocument('en', 'What %item% do you serve here', 'item.show.all');

    manager.addAnswer('en', 'item.show.all', 'Here are our %item%s: ... *items here*');
    manager.addAnswer('en', 'item.show.all', 'For %item%s, we serve: ... *items here*');
    manager.addAnswer('en', 'item.show.all', 'Our %item%s include: ... *items here*');
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
    // manager.addDocument('en', '%item%', 'show.description');
    manager.addDocument('en', 'Can you tell me about the %order%', 'show.description');

    manager.addAnswer('en', 'show.description', '*info here* ... I can add this to your order if you\'d like!');
    manager.addAnswer('en', 'show.description', '*info here* ... Let me know if you want to order this!');
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
    // manager.addDocument('en', 'can i get a %order% and %order%', 'add.to.order');
    manager.addDocument('en', 'can i order the %order%', 'add.to.order');
    // manager.addDocument('en', 'can i order a %order% %item%', 'add.to.order');
    manager.addDocument('en', 'add a %order% to my order', 'add.to.order');
    manager.addDocument('en', 'can i get a %order% %item%', 'add.to.order');
    // manager.addDocument('en', 'can i order %number% %order%', 'add.to.order');
    // manager.addDocument('en', 'one %order%, please', 'add.to.order');
    manager.addDocument('en', 'ill take a %order% please', 'add.to.order');
    manager.addDocument('en', 'ill take a %order% %modify% %ingredient%', 'add.to.order');
    // manager.addDocument('en', 'I\'ll take a %order%', 'add.to.order');
    // manager.addDocument('en', '%order%', 'add.to.order');
    // manager.addDocument('en', 'can i have a %order% %item% and a %order% %item%', 'add.to.order');
    manager.addDocument('en', 'can i have a %order% and a %order%', 'add.to.order');
    // manager.addDocument('en', 'ill take a %order% %item% and a %order% %item%', 'add.to.order');
    manager.addDocument('en', 'ill take the %order% and a %order%', 'add.to.order');
    manager.addDocument('en', 'id like a %order%', 'add.to.order');

    
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

    manager.addAnswer('en', 'remove.from.order', 'I\'ve removed %order% from your order');
    manager.addAnswer('en', 'remove.from.order', '%order% has been removed from your order');
    manager.addAnswer('en', 'remove.from.order', 'Removing %order% from your order');
    manager.addAnswer('en', 'remove.from.order', '%order% has been removed from your order');
    /* *********************************************************************** */


    /* *********************************************************************** */
    // Replacing/changing an item or ingredient in current order
    manager.addDocument('en', 'can i get a %item% %switch% the %item%', 'update.order');
    manager.addDocument('en', 'can i %switch% the %item% for the %item%', 'update.order');
    manager.addDocument('en', 'would it be okay to %switch% the %item% to a %item%', 'update.order');
    manager.addDocument('en', 'could you %switch% the %item% to a %item%', 'update.order');
    

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
    manager.addDocument('en', 'can i see my order', 'current.order');
    manager.addDocument('en', 'can i see my cart', 'current.order');

    manager.addAnswer('en', 'current.order', 'Here\'s what\'s currently in your order: *current order here* ... Let me know if you want to add anything else!');
    manager.addAnswer('en', 'current.order', 'Here\'s what you\'ve ordered so far: *current order here* ... You can still add any items you want.');
    manager.addAnswer('en', 'current.order', 'Your current order: *current order here* ... Let me know if I can change anything for you.');
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
    manager.addDocument('en', 'i do', 'answer.yes')

    manager.addAnswer('en', 'answer.yes', 'Got it!')



    manager.addDocument('en', 'no', 'answer.no')
    manager.addDocument('en', 'nah', 'answer.no')
    manager.addDocument('en', 'nope', 'answer.no')
    manager.addDocument('en', 'i dont', 'answer.no')

    manager.addAnswer('en', 'answer.no', 'No problem. Let me know if I can help with anything else!')


    
    manager.addDocument('en', 'can i get that', 'answer.order.that')
    manager.addDocument('en', 'can i order that', 'answer.order.that')
    manager.addDocument('en', 'i want that', 'answer.order.that')
    manager.addDocument('en', 'get that for me', 'answer.order.that')
    manager.addDocument('en', 'add that to my order', 'answer.order.that')
    // manager.addDocument('en', 'can i order that %modify% %ingredients%', 'answer.order.that')

    manager.addAnswer('en', 'answer.order.that', 'Sure! I\'ve just added it to your order. Anything else?')



    // Recognizing specified items in input and considering different spellings and synomyms
    //Food types
    manager.addNamedEntityText('item', 'entree', ['en'], ['plate', 'plates', 'entree', 'entrees', 'main plates', 'main plate']);
    manager.addNamedEntityText('item', 'pizza', ['en'], ['pizza', 'pizzas']);
    manager.addNamedEntityText('item', 'pasta', ['en'], ['pasta', 'pastas']);
    manager.addNamedEntityText('item', 'salad', ['en'], ['salad', 'salads']);
    manager.addNamedEntityText('item', 'starter', ['en'], ['starter', 'starters', 'appetizer', 'appetizers', 'app', 'apps']);
    manager.addNamedEntityText('item', 'sangria', ['en'], ['sangria', 'sangrias']);
    manager.addNamedEntityText('item', 'mocktail', ['en'], ['mocktail', 'mocktails', 'no alcohol', 'non alcoholic']);
    manager.addNamedEntityText('item', 'cocktail', ['en'], ['cocktail', 'cocktails']);
    manager.addNamedEntityText('item', 'martini', ['en'], ['martini', 'martinis']);
    manager.addNamedEntityText('item', 'margarita', ['en'], ['margarita', 'margaritas']);
    manager.addNamedEntityText('item', 'dessert', ['en'], ['dessert', 'desserts', 'sweet treat', 'sweet treats']);
    
    //Types of items in each category
    manager.addNamedEntityText('add.to.order', 'entree', ['en'], validEntrees);
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


    


    // //Ingredient types
    // manager.addNamedEntityText('ingredients', 'olives', ['en'], ['olives', "olive's"]);
    // manager.addNamedEntityText('ingredients', 'peppers', ['en'], ['peppers']);
    // manager.addNamedEntityText('ingredients', 'pepperoni', ['en'], ['pepperonis', "pepperoni's", 'pepperoni']);
    // manager.addNamedEntityText('ingredients', 'basil', ['en'], ['basil', 'fresh basil']);
    // manager.addNamedEntityText('ingredients', 'jalapeno', ['en'], ['jalapenos']);
    // manager.addNamedEntityText('ingredients', 'tomato', ['en'], ['tomato', "tomato's"]);

    
    // Cheeses
    manager.addNamedEntityText('ingredients', 'gouda', ['en'], ['gouda', 'gouda cheese', 'goudas']);
    manager.addNamedEntityText('ingredients', 'mozzarella', ['en'], ['mozzarella', 'mozzarella cheese', 'mozzarellas']);
    manager.addNamedEntityText('ingredients', 'parmesan', ['en'], ['parmesan', 'parmesan cheese', 'parmesans', 'parm']);
    manager.addNamedEntityText('ingredients', 'romano', ['en'], ['romano', 'romano cheese', 'romanos']);
    manager.addNamedEntityText('ingredients', 'queso quesadilla', ['en'], ['queso quesadilla', 'quesadilla cheese', 'quesos']);
    manager.addNamedEntityText('ingredients', 'burrata', ['en'], ['burrata', 'burrata cheese', 'burratas']);
    manager.addNamedEntityText('ingredients', 'monterey jack', ['en'], ['monterey jack', 'jack cheese', 'monterey jack cheese', 'monterey jacks']);
    manager.addNamedEntityText('ingredients', 'gorgonzola', ['en'], ['gorgonzola', 'gorgonzola cheese', 'gorgonzolas']);
    
    // Meats
    manager.addNamedEntityText('ingredients', 'applewood smoked bacon', ['en'], ['applewood smoked bacon', 'bacon', 'bacons']);
    manager.addNamedEntityText('ingredients', 'pepperoni', ['en'], ['pepperoni', 'pepperonis']);
    manager.addNamedEntityText('ingredients', 'spicy Italian sausage', ['en'], ['spicy Italian sausage', 'Italian sausage', 'sausage', 'sausages']);
    manager.addNamedEntityText('ingredients', 'capicola ham', ['en'], ['capicola ham', 'ham', 'capicolas', 'hams']);
    manager.addNamedEntityText('ingredients', 'applewood smoked ham', ['en'], ['applewood smoked ham', 'ham', 'hams']);
    manager.addNamedEntityText('ingredients', 'marinated steak', ['en'], ['marinated steak', 'steak', 'steaks']);
    manager.addNamedEntityText('ingredients', 'turkey', ['en'], ['turkey', 'turkeys']);
    manager.addNamedEntityText('ingredients', 'salami', ['en'], ['salami', 'salamis']);
    // manager.addNamedEntityText('ingredients', 'shrimp', ['en'], ['shrimp', 'shrimps']);
    manager.addNamedEntityText('ingredients', 'andouille sausage', ['en'], ['andouille sausage', 'andouille sausages', 'sausage', 'sausages']);
    manager.addNamedEntityText('ingredients', 'tasso ham', ['en'], ['tasso ham', 'ham', 'tassos']);
    manager.addNamedEntityText('ingredients', 'beef', ['en'], ['beef', 'beefs']);
    manager.addNamedEntityText('ingredients', 'pork', ['en'], ['pork', 'porks']);
    manager.addNamedEntityText('ingredients', 'chicken', ['en'], ['chicken']);
    
    // Vegetables and Herbs
    manager.addNamedEntityText('ingredients', 'red onions', ['en'], ['red onion', 'red onions', 'onions']);
    // manager.addNamedEntityText('ingredients', 'cremini mushrooms', ['en'], ['cremini mushroom', 'cremini mushrooms', 'mushroom', 'mushrooms']);
    manager.addNamedEntityText('ingredients', 'scallions', ['en'], ['scallion', 'scallions', 'green onion', 'green onions', 'spring onion', 'spring onions']);
    manager.addNamedEntityText('ingredients', 'broccolini', ['en'], ['broccolini', 'broccolinis', 'broccoli']);
    // manager.addNamedEntityText('ingredients', 'zucchini', ['en'], ['zucchini', 'zucchinis', 'courgette', 'courgettes']);
    // manager.addNamedEntityText('ingredients', 'cherry tomatoes', ['en'], ['cherry tomato', 'cherry tomatoes', 'tomato', 'tomatoes']);
    // manager.addNamedEntityText('ingredients', 'basil', ['en'], ['basil', 'fresh basil', 'basils']);
    manager.addNamedEntityText('ingredients', 'arugula', ['en'], ['arugula', 'arugulas', 'rocket', 'rockets']);
    manager.addNamedEntityText('ingredients', 'lettuce', ['en'], ['lettuce']);  // "Lettuce" doesn't usually pluralize
    manager.addNamedEntityText('ingredients', 'green peppers', ['en'], ['green pepper', 'green peppers', 'bell pepper', 'bell peppers', 'pepper', 'peppers']);
    manager.addNamedEntityText('ingredients', 'olives', ['en'], ['olive', 'olives', 'black olive', 'black olives']);
    // manager.addNamedEntityText('ingredients', 'avocado', ['en'], ['avocado', 'avocados']);
    manager.addNamedEntityText('ingredients', 'carrots', ['en'], ['carrot', 'carrots']);
    manager.addNamedEntityText('ingredients', 'bean sprouts', ['en'], ['bean sprout', 'bean sprouts', 'sprout', 'sprouts']);
    // manager.addNamedEntityText('ingredients', 'corn', ['en'], ['corn', 'corns']);
    manager.addNamedEntityText('ingredients', 'poblanos', ['en'], ['poblano', 'poblanos', 'poblano pepper', 'poblano peppers']);
    manager.addNamedEntityText('ingredients', 'yellow onions', ['en'], ['yellow onion', 'yellow onions', 'onion', 'onions']);
    manager.addNamedEntityText('ingredients', 'jicama', ['en'], ['jicama', 'jicamas']);
    manager.addNamedEntityText('ingredients', 'cilantro', ['en'], ['cilantro', 'fresh cilantro']);
    // manager.addNamedEntityText('ingredients', 'lime', ['en'], ['lime', 'limes']);
    manager.addNamedEntityText('ingredients', 'romaine lettuce', ['en'], ['romaine lettuce', 'lettuce']);
    manager.addNamedEntityText('ingredients', 'spinach', ['en'], ['spinach', 'spinaches']);
    manager.addNamedEntityText('ingredients', 'red cabbage', ['en'], ['red cabbage', 'cabbage']);
    manager.addNamedEntityText('ingredients', 'cucumber', ['en'], ['cucumber', 'cucumbers']);
    manager.addNamedEntityText('ingredients', 'serrano peppers', ['en'], ['serrano pepper', 'serrano peppers']);
    manager.addNamedEntityText('ingredients', 'red chilies', ['en'], ['red chili', 'red chilies', 'chili', 'chilies']);
    manager.addNamedEntityText('ingredients', 'lemon', ['en'], ['lemon', 'lemons']);
    manager.addNamedEntityText('ingredients', 'parsley', ['en'], ['parsley', 'fresh parsley']);
    
    // Sauces and Seasonings
    manager.addNamedEntityText('ingredients', 'virgin olive oil', ['en'], ['virgin olive oil', 'olive oil', 'oils']);
    manager.addNamedEntityText('ingredients', 'garlic', ['en'], ['garlic', 'fresh garlic', 'garlics']);
    manager.addNamedEntityText('ingredients', 'greek oregano', ['en'], ['greek oregano', 'oregano', 'oreganos']);
    manager.addNamedEntityText('ingredients', 'neapolitan pizza sauce', ['en'], ['neapolitan pizza sauce', 'pizza sauce', 'tomato sauce', 'sauces']);
    manager.addNamedEntityText('ingredients', 'spicy marinara', ['en'], ['spicy marinara', 'marinara sauce', 'spicy sauce', 'marinaras']);
    manager.addNamedEntityText('ingredients', 'jalapeño lime sauce', ['en'], ['jalapeño lime sauce', 'lime sauce', 'jalapeño sauce', 'sauce']);
    manager.addNamedEntityText('ingredients', 'cajun sauce', ['en'], ['cajun sauce', 'cajun', 'sauce']);
    
    // Toppings and Extras
    manager.addNamedEntityText('ingredients', 'chopped egg', ['en'], ['chopped egg', 'egg', 'eggs']);
    manager.addNamedEntityText('ingredients', 'tortilla strips', ['en'], ['tortilla strip', 'tortilla strips']);
    manager.addNamedEntityText('ingredients', 'wonton strips', ['en'], ['wonton strip', 'wonton strips']);
    manager.addNamedEntityText('ingredients', 'garlic butter croutons', ['en'], ['garlic butter crouton', 'garlic butter croutons', 'croutons']);
    manager.addNamedEntityText('ingredients', 'roasted peanuts', ['en'], ['roasted peanut', 'roasted peanuts', 'peanut', 'peanuts']);
    
    // Dressings and Vinaigrettes
    manager.addNamedEntityText('ingredients', 'mustard herb vinaigrette', ['en'], ['mustard herb vinaigrette', 'herb vinaigrette', 'vinaigrette']);
    manager.addNamedEntityText('ingredients', 'thai peanut dressing', ['en'], ['thai peanut dressing', 'peanut dressing', 'dressing']);
    manager.addNamedEntityText('ingredients', 'chili lime vinaigrette', ['en'], ['chili lime vinaigrette', 'lime vinaigrette', 'vinaigrette']);
    
    // Pasta Types
    manager.addNamedEntityText('ingredients', 'spinach fettuccine', ['en'], ['spinach fettuccine', 'fettuccine']);
    // manager.addNamedEntityText('ingredients', 'spaghetti', ['en'], ['spaghetti', 'spaghettis']);
    manager.addNamedEntityText('ingredients', 'ziti', ['en'], ['ziti', 'zitis']);









    //Recognizes when user wants to add or remove ingredient from an item
    manager.addNamedEntityText('modify', 'positive', ['en'], ['add', 'extra', 'put some', 'with']);
    manager.addNamedEntityText('modify', 'negative', ['en'], ['take off', 'no', 'without']);

    //Needed to find out what item you want to replace and what item to replace it with
    manager.addNamedEntityText('switch', 'replace', ['en'], ['replace', 'instead of', 'change', 'substitute', 'swap'])

    //Saves the training data, allowing the bot to respond consistently across different chats (I believe)
    manager.train().then(async() => {
        manager.save();
    });
};