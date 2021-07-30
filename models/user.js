

const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const userSchema =  new Schema({
  _sessionId : {type: String}, 
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true},
        title: {type: String, required: true},
        image: {type: String, required: true}, 
        quantity: {type: Number, required: true },
        size: {type: String, required: false},
        price: {type: Number, required: true}
      }
    ]
  },
  shippingInfo: 
    {
      name: {
        firstName: { type: String},
        lastName: { type: String},
        email: { type: String}
      },
      address: 
        {
        address1: {type: String, },
        address2: {type: String, required: false},
        city: {type: String, },
        state: {type: String, },
        zipcode: {type: Number, }
        }
     
    }

});

userSchema.methods.addToCart = function(product, quantity, size, image, title, price){
    const testItemsArray = this.cart.items; 

    const findIndex = ()=> {
        for (let i = 0; i < testItemsArray.length; i++){
            // console.log(i, testItemsArray[i].productId.toString() === product._id.toString() && testItemsArray[i].size.toString() === size.toString())
            if (testItemsArray[i].productId.toString() === product._id.toString() && testItemsArray[i].size === size){
                return i
            }
        }

                
            
    };

    // const cartProductIndex = this.cart.items.findIndex(item => {
    //             return item.productId.toString() === item._id.toString();
    //           });

    const cartProductIndex = findIndex();
    

      let newQuantity = 1;
      const updatedCartItems = [...this.cart.items];
  
      if (cartProductIndex >= 0) {
          if (this.cart.items[cartProductIndex].size === size) {
            newQuantity = this.cart.items[cartProductIndex].quantity + quantity;
            updatedCartItems[cartProductIndex].quantity = newQuantity;

          } else {
            updatedCartItems.push({
                productId: product._id,
                title: title,
                image: image,
                quantity: quantity,
                size: size,
                price: price,
            })
        }
        
      } else {
        updatedCartItems.push({
            productId: product._id,
            title: title,
            image: image,
            quantity: quantity,
            size: size,
            price: price,
        });
      }
      const updatedCart = {
        items: updatedCartItems
      };
      this.cart = updatedCart; 
      return this.save();
  
  };

userSchema.methods.removeFromCart = function(productId, size){
    let updatedCartItems = this.cart.items; 
    // console.log(updatedCartItems);

    let cartIndexLocation; 

    for (let i=0; i < updatedCartItems.length; i++){
        if (updatedCartItems[i].size === size.toString() && updatedCartItems[i].productId.toString() === productId){
            // console.log(updatedCartItems[i]._id);
            cartIndexLocation = updatedCartItems[i]._id; 
        }
    }

    updatedCartItems = this.cart.items.filter(item =>{
       return (item._id.toString() !== cartIndexLocation.toString());
      
    });
    

    this.cart.items = updatedCartItems; 
    return this.save();
  };
  
userSchema.methods.clearCart = function(){
    this.cart = {items: []};
    return this.save();
  }

userSchema.methods.addShippingInfo = function(first_name, last_name, email, address1, address2, city, state, zipcode) {
  let shippingInfoAddress = this.shippingInfo.address;

  this.shippingInfo.name.firstName = first_name;
  this.shippingInfo.name.lastName = last_name;
  this.shippingInfo.name.email = email;

  shippingInfoAddress.address1 = address1;
  shippingInfoAddress.address2 = address2;
  shippingInfoAddress.city = city;
  shippingInfoAddress.state = state;
  shippingInfoAddress.zipcode = zipcode;
  // this.shippingInfo.address.push({
  //   address1: address1,
  //   address2: address2,
  //   city: city,
  //   state: state,
  //   zipcode: zipcode
  // })

  // this.shippingInfo = shippingInfo;
  return this.save();

};

module.exports = mongoose.model('User', userSchema);