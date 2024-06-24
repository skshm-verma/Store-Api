const Product = require('../models/product');

const getAllProductsStatic = async (req,res) => {

    const products = await Product.find({featured: true});
    // throw new Error('testing async errors')
    res.status(200).json({products, nbHits: products.length});
}

const getAllProducts = async (req,res) => {
    const { featured, company, name } = req.query;
    const  queryObject = {};

    if(featured){
        queryObject.featured = featured === "true" ? true : false;
    }
    if(company){
        queryObject.company = company;
    }
    if(name){
        queryObject.name = {$regex: name, $options: 'i'};  //this is query regex in mongoDb to search for product similar to the value provided, study about this over https://www.mongodb.com/docs/manual/reference/operator/query/regex/ url.
    }

    const products= await Product.find(queryObject);
    res.status(200).json({products, nbHits: products.length});
}

module.exports = { 
    getAllProductsStatic,
    getAllProducts
}