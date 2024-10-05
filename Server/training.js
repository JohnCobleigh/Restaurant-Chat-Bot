const { SchemaTypeOptions, Mongoose, default: mongoose } = require("mongoose");
const { Pizza } = require("./models");
// const main = require("./server.js")
const { 
    validPizzas, validPastas, validMargaritas, 
    ValidMartinis, validMocktails, validSalads, validSangrias, 
    validCocktails, validStarters, validDeserts 
} = require("./validOrders");
const orderVerification = require("./orderVerification");




module.exports = (manager) => {
    manager.addDocument('en', 'What is on the menu?', 'menu.ask');
    manager.addDocument('en', 'What items do you have?', 'menu.ask');
    manager.addDocument('en', 'Show me the menu', 'menu.ask');
    manager.addDocument('en', 'Whats on the menu', 'menu.ask');
    manager.addDocument('en', 'Give me the menu', 'menu.ask');


    manager.addDocument('en', 'Give me %order% %modify% %ingredients%', 'order');
    manager.addDocument('en', 'i want a %order%, %modify% %ingredients%, %ingredients%, and %ingredients%', 'order');
    manager.addDocument('en', 'order me a %order% %modify% %ingredients% and %ingredients%', 'order');
    manager.addDocument('en', 'let me get a %order%, and %modify% %ingredients% on it', 'order');
    manager.addDocument('en', 'can you add a %order% %modify% %ingredient% to my order', 'order');
    manager.addDocument('en', 'can i get a %order%', 'order')

    // leaving for reference
    /*manager.addDocument('en', 'Show me the pizzas', 'pizza.show.all')
    manager.addDocument('en', 'What pizza choices do you have', 'pizza.show.all')
    manager.addDocument('en', 'List all the pizzas', 'pizza.show.all')
    manager.addDocument('en', 'What pizzas do you have', 'pizza.show.all')

    manager.addDocument('en', 'Show me the pastas', 'pasta.show.all');
    manager.addDocument('en', 'What pasta choices do you have', 'pasta.show.all');
    manager.addDocument('en', 'List all the pastas', 'pasta.show.all');
    manager.addDocument('en', 'What pastas do you have', 'pasta.show.all');*/


    manager.addDocument('en', 'Show me the %item%', 'item.show.all')
    manager.addDocument('en', 'What %item% choices do you have', 'item.show.all')
    manager.addDocument('en', 'List all the %item%', 'item.show.all')
    manager.addDocument('en', 'What %item% do you have', 'item.show.all')

    manager.addNamedEntityText('item', 'plate', ['en'], ['plate', 'plates', 'entree', 'entrees'])
    manager.addNamedEntityText('item', 'pizza', ['en'], ['pizza', 'pizzas', 'pie', 'pies'])
    manager.addNamedEntityText('item', 'pasta', ['en'], ['pasta', 'pastas'])
    manager.addNamedEntityText('item', 'salad', ['en'], ['salad', 'salads'])
    manager.addNamedEntityText('item', 'starter', ['en'], ['starter', 'starters', 'appetizer', 'appetizers', 'app', 'apps'])
    manager.addNamedEntityText('item', 'sangria', ['en'], ['sangria', 'sangrias'])
    manager.addNamedEntityText('item', 'mocktail', ['en'], ['mocktail', 'mocktails', 'no alcohol', 'non alcoholic'])
    manager.addNamedEntityText('item', 'cocktail', ['en'], ['cocktail', 'cocktails'])
    manager.addNamedEntityText('item', 'martini', ['en'], ['martini', 'martinis'])
    manager.addNamedEntityText('item', 'margarita', ['en'], ['margarita', 'margaritas'])
    manager.addNamedEntityText('item', 'dessert', ['en'], ['dessert', 'desserts', 'sweet treat', 'sweet treats'])
    manager.addNamedEntityText('item', 'pasta', ['en'], ['pasta', 'pastas'])
    
    manager.addNamedEntityText('order', 'pizza', ['en'], validPizzas)
    manager.addNamedEntityText('order', 'pasta', ['en'], validPastas)
    manager.addNamedEntityText('order', 'margarita', ['en'], validMargaritas)
    manager.addNamedEntityText('order', 'martini', ['en'], ValidMartinis)
    manager.addNamedEntityText('order', 'mocktail', ['en'], validMocktails)
    manager.addNamedEntityText('order', 'salads', ['en'], validSalads)
    manager.addNamedEntityText('order', 'sangrias', ['en'], validSangrias)
    manager.addNamedEntityText('order', 'cocktails', ['en'], validCocktails)
    manager.addNamedEntityText('order', 'starter', ['en'], validStarters)
    manager.addNamedEntityText('order', 'deserts', ['en'], validDeserts)







    manager.addNamedEntityText('ingredients', 'olives', ['en'], ['olives', "olive's"])
    manager.addNamedEntityText('ingredients', 'peppers', ['en'], ['peppers'])
    manager.addNamedEntityText('ingredients', 'pepperoni', ['en'], ['pepperonis', "pepperoni's", 'pepperoni'])
    manager.addNamedEntityText('ingredients', 'basil', ['en'], ['basil', 'fresh basil'])
    manager.addNamedEntityText('ingredients', 'japalenio', ['en'], ['japalenio', "japalenio's", 'japalenios'])
    manager.addNamedEntityText('ingredients', 'tomato', ['en'], ['tomato', "tomato's"])


    manager.addNamedEntityText('modify', 'positive', ['en'], ['add', 'extra', 'put some', 'with'])
    manager.addNamedEntityText('modify', 'negative', ['en'], ['remove', 'take off', 'no', 'without'])




    manager.addAnswer('en', 'menu.ask', 'Here is the menu: ');
    // manager.addAnswer('en', 'order', 'Your {{ order }} is ordered');
    manager.addAnswer('en', 'order', '');
    
    



    // manager.addAnswer('en', 'pizza.show.all', 'Here are our pizzas: ')
    // manager.addAnswer('en', 'pasta.show.all', 'Here are our pastas: ')

    
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