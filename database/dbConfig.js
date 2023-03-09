const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/Blog-app')

const main = async()=> {
    try{
        await mongoose.connect('mongodb://localhost:27017/Blog-app',{
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
        console.log("Database Connetecd Suucessfully");
    }
    catch(error){
        console.log("Error while connecting with database", error);
    }
}
main();

