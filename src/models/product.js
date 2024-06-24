const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'product name must be provided']   //second value is the error message
    },
    price: {
        type: Number,
        required: [true, 'product price must be provided']
    },
    featured: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 4.5
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    company: {
        type: String,
        enum: {
             values: ['ikea', 'liddy', 'caressa', 'marcos'],
             message: '{VALUE} is not supported' //when u want to show custom error message if the value does't match  
         },
        // enum: ['ikea', 'liddy', 'caressa', 'marcos']    //when you want to provide a specific/limited number of 
                                                        //properties to field use enum with mongoose.
    }
})

module.exports = mongoose.model('Product', productSchema);