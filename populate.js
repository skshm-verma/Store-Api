require('dotenv').config();

const connectDB = require('./src/db/connect');
const Product = require('./src/models/product');

const jsonProducts = require('./product.json')


const start = async () => {
    try{
        //connectDb
        await connectDB(process.env.MONGO_URI)
        await Product.deleteMany();  // this will delete all products from the schema
        await Product.create(jsonProducts);
        process.exit(0); //By this code we exit the code/execution
    }catch(err){
        console.log(err);
        process.exit(1);
    }
} 

start();