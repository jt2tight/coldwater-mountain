const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const cartSchema = new Schema({
    _sessionId: {type: String},

    items: [
        {
            productId: {type: Schema.Types.ObjectId, ref: 'Product', require: true},
            quantity: {type: Number, required: true},
            size: {type: String, required: false}
        },

    ]
    

});

cartSchema.methods.addToCart = function(product, quantity, size){
    const cartProductIndex = this.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
      });
      let newQuantity;
      const updatedCartItems = [...this.items];
  
      if (cartProductIndex >= 0) {
          if (cartProductIndex.size === size){
            newQuantity = this.items[cartProductIndex].quantity + quantity;
            updatedCartItems[cartProductIndex].quantity = newQuantity;

          }
        
        
      } else {
        updatedCartItems.push({
          productId: product._id,
          quantity: quantity,
          size: size
        });
      }
      const updatedCart = {
        items: updatedCartItems
      };
      this.cart = updatedCart; 
      return this.save();
  
};


// const cartSchema = new Schema({
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

//     items: [
//         {
//             productId: {type: Schema.Types.ObjectId, ref: 'Product', require: true},
//             quantity: {type: Number, required: true}
//         },

//     ]
    

// });

module.exports = mongoose.model('Cart', cartSchema)