require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const connectDB = require('./src/db/connect');
const productsRouter = require('./src/routes/products');

//middleware
const notFoundMiddleware = require('./src/middleware/not-found');
const errorMiddleware = require('./src/middleware/error-handler');
app.use(express.json());


//routes
app.get('/', (req, res) => {
   res.send('<h1>Store Api</h1><a href="/api/v1/products">Products Route</a>');
})

app.use('/api/v1/products', productsRouter)

//product routes


app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 9000;
const start = async () => {
    try{
        //connectDb
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening at port ${port}`))
    }catch(err){
        console.log(err);
    }
} 

start();