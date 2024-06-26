const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {

    const products = await Product.find({ price: { $gt: 30 } }).sort('price').select('name price');
    // throw new Error('testing async errors')
    res.status(200).json({ products, nbHits: products.length });
}

const getAllProducts = async (req, res) => {
    const { featured, company, name, sort, fields, numericFilters } = req.query;
    const queryObject = {};

    if (featured) {
        queryObject.featured = featured === "true" ? true : false;
    }
    if (company) {
        queryObject.company = company;
    }
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' };  //this is query regex in mongoDb to search for product similar to the value provided, study about this over https://www.mongodb.com/docs/manual/reference/operator/query/regex/ url.
    }
    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '<': '$lt',
            '=': '$eq',
            '>=': '$gte',
            '<=': '$lte',
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`);
        const options = ['price', 'rating'];
        filters = filters.split(',')
            .forEach((item) => {
                const [field, operator, value] = item.split('-');
                if (options.includes(field)) {
                    queryObject[field] = { [operator]: Number(value) };
                }
            });
    }

    let result = Product.find(queryObject)
    //sort  -ve value(decending order)
    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList)
    } else {
        result = result.sort('createAt')
    }
    // what only fields you required from db
    if (fields) {
        const fieldList = fields.split(',').join(' ');
        result = result.select(fieldList)
    }

    //page- according to the number of pages the data will be shown(skipping the previous page values & number of items)
    const page = Number(req.query.page) || 1;
    //limit - number items you want to get from db
    const limit = Number(req.query.limit) || 10;
    //skip - number of items you want to skip before getting from db
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const products = await result;
    res.status(200).json({ products, nbHits: products.length });
}

module.exports = {
    getAllProductsStatic,
    getAllProducts
}