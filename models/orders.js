const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

// const orderSchema = new Schema({
//     products: [{
//         product: { type: Object, required: true },
//         quantity: {type: Number, required: true}
//     }],
//     user: {
//         email: {type: String},
//         address: {type: String},
//         address2: {
//             type: String,
//             required: false,
//         },
//         city: {type: String},
//         zipcode: {type: Number},
//         telephone: {type: Number}  
    
//     },
    

// });

// module.exports = mongoose.model('Order', orderSchema)

const orderSchema = ({
    products: [{
        product: { type: Object, required: true },
        quantity: {type: Number, required: true},
        size: {type: String, required: true}
    }],
    user: {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    }
});

module.exports = mongoose.model('Order', orderSchema)