const { SchemaTypeOptions, Mongoose, default: mongoose } = require("mongoose");
const { Pizza } = require("./models");



module.exports = (manager) => {
    manager.addDocument('en', 'What is on the menu?', 'menu.ask');
    manager.addDocument('en', 'What items do you have?', 'menu.ask');
    manager.addDocument('en', 'Show me the menu', 'menu.ask');
    manager.addDocument('en', 'Whats on the menu', 'menu.ask');
    manager.addDocument('en', 'Give me the menu', 'menu.ask');





    





    manager.addDocument('en', 'Give me %order% %modify% %ingredients%', 'pizza.order');
    manager.addDocument('en', 'i want a %order%, %modify% %ingredients%, %ingredients%, and %ingredients%', 'pizza.order');
    manager.addDocument('en', 'order me a %order% %modify% %ingredients% and %ingredients%', 'pizza.order');
    manager.addDocument('en', 'let me get a %order%, and %modify% %ingredients% on it', 'pizza.order');
    manager.addDocument('en', 'can you add a %order% %modify% %ingredient% to my order', 'pizza.order');

    



    manager.addDocument('en', 'Show me the pizzas', 'pizza.show.all')
    manager.addDocument('en', 'What pizza choices do you have', 'pizza.show.all')
    manager.addDocument('en', 'List all the pizzas', 'pizza.show.all')
    manager.addDocument('en', 'What pizzas do you have', 'pizza.show.all')


    // manager.addDocument('en', 'Show me the pastas', 'pasta.show.all');
    // manager.addDocument('en', 'What pasta choices do you have', 'pasta.show.all');
    // manager.addDocument('en', 'List all the pastas', 'pasta.show.all');
    // manager.addDocument('en', 'What pastas do you have', 'pasta.show.all');
    
    






    manager.addNamedEntityText('ingredients', 'olives', ['en'], ['olives', "olive's"])
    manager.addNamedEntityText('ingredients', 'peppers', ['en'], ['peppers'])
    manager.addNamedEntityText('ingredients', 'pepperoni', ['en'], ['pepperonis', "pepperoni's", 'pepperoni'])
    manager.addNamedEntityText('ingredients', 'basil', ['en'], ['basil', 'fresh basil'])
    manager.addNamedEntityText('ingredients', 'japalenio', ['en'], ['japalenio', "japalenio's", 'japalenios'])
    manager.addNamedEntityText('ingredients', 'tomato', ['en'], ['tomato', "tomato's"])





    manager.addNamedEntityText('modify', 'positive', ['en'], ['add', 'extra', 'put some', 'with'])
    manager.addNamedEntityText('modify', 'negative', ['en'], ['remove', 'take off', 'no', 'without'])



    manager.addNamedEntityText('order', 'pizza', ['en'], ['pizza', 'California Club pizza', 'Margerita pizza', 'pepperoni Pizza'])
    manager.addNamedEntityText('order', 'pasta', ['en'], ['spagetti', 'angel hair pasta', 'lasagna', 'fettucine alfredo', 'pasta'])

    







    manager.addAnswer('en', 'menu.ask', 'Here is the menu: ');
    manager.addAnswer('en', 'pizza.order', 'Your {{ order }} is ordered');


    // manager.addAnswer('en', 'pizza.show.all', 'Here are our pizzas: ')
    // manager.addAnswer('en', 'pasta.show.all', 'Here are our pastas: ')

    




    manager.train().then(async() => {
        manager.save();
    });
};