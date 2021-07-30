const Product = require('../models/products');
const Cart = require('../models/cart');
const User = require('../models/user');
const session = require('express-session');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const Order = require('../models/orders');
const { validationResult } = require('express-validator/check')

exports.getShop = (req, res, next) => {
    Product.find().lean()
    .then(data => {
        return res.status(422).render('shop/shop',{
            products: data,
            path:'/shop',
            pageTitle:'Shop Coldwater',
            errorMessage: req.flash('error')           
        })
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500; 
      return next(error);
    });
    
    
};

exports.getShuttles = (req, res, next) => {
    Product.find().lean()
    .then(data => {
        return res.status(422).render('shop/shop',{
            shuttles: data,
            path:'/shop',
            pageTitle:'Shop Coldwater'            
        })
    })
    .catch(err => {
      const error = new Error(err);
     error.httpStatusCode = 500; 
     return next(error);
    });
    
    
};

exports.getCart = (req, res, next) => {

    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
        const products = user.cart.items; 
        res.status(422).render('shop/cart',{
            products: products,
            path:'/cart',
            sessionId: session._id,
            pageTitle:'Your Cart - Shop Coldwater',
            errorMessage: req.flash('error')      
        })
    })
    .catch(err => {
      const error = new Error(err);
     error.httpStatusCode = 500; 
     return next(error);
    });
    
    
};

exports.postCart = (req, res, next) => {
    const title = req.body.title;
    const image = req.body.image;
    const price = req.body.price;
    const quantity = 1;
    const size = req.body.size;

    const prodId = req.body.productId;
    Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product, quantity, size, image, title, price);
    })
    .then(result => {
      res.status(422).redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
     error.httpStatusCode = 500; 
     return next(error);
    })
};

exports.postDeleteItem = (req, res, next) => {
    const productId = req.body.productId;
    const size = req.body.size; 

    req.user.removeFromCart(productId, size)
    .then(result => {
        res.status(422).redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
     error.httpStatusCode = 500; 
     return next(error);
    })
}

exports.getShipping = (req, res, next) => {
    let products;
    let total;

    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      products = user.cart.items;
      total = 0; 
      products.forEach(p => {
        total += p.quantity * p.price;
      })
    })
    .then(session => {
        res.status(422).render('shop/shipping-info', {
          path: 'cart/shipping-info',
          pageTitle: 'Checkout',
          products: products,
          totalSum: total,
          errorMessage: req.flash('error'),
          oldInput: {
              first_name:"",
              last_name: "",
              email: "",
              address1: "",
              address2: "",
              city:"",
              state:"",
              zipcode:""
          }
                     
        })

    })
    .catch(err => {
      const error = new Error(err);
     error.httpStatusCode = 500; 
     return next(error);
    })


};

exports.postShipping = (req, res, next) => {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email; 
    const address1 = req.body.address1; 
    const address2 = req.body.address2; 
    const city = req.body.city;
    const state = req.body.state;
    const zipcode = req.body.zipcode;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      products = user.cart.items;
      total = 0; 
      products.forEach(p => {
        total += p.quantity * p.price;
      })
    })
    .then(session => {
        return res.status(422).render('shop/shipping-info', {
          path: 'cart/shipping-info',
          pageTitle: 'Checkout',
          products: products,
          totalSum: total,
          errorMessage: errors.array()[0].msg,
          oldInput: { first_name: first_name, last_name: last_name, email: email, address1: address1, address2: address2, city: city, state: state, zipcode: zipcode}
                     
        })

    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500; 
      return next(error);
    })
    }



    User.findById(req.user._id)
    .then(user => {
        return user.addShippingInfo(first_name, last_name, email, address1, address2, city, state, zipcode); 
    })
    .then(user => {
        console.log(user);
        res.status(422).redirect('cart/checkout')
    })
    .catch(err => {
     const error = new Error(err);
     error.httpStatusCode = 500; 
     return next(error);
    })
       
};

exports.getCheckout = (req, res, next) => {
    let products;
    let total;
    let shippingInfo = req.user.shippingInfo;
   

    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      products = user.cart.items;
      total = 0; 
      products.forEach(p => {
        total += p.quantity * p.price;
      });
      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: products.map(p => {
          return {
            name: p.title + ' ' + p.size,
            amount: parseInt(p.price * 100),
            currency: 'usd',
            quantity: p.quantity
          };
        }),
        success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
      });
    })
    .then(session => {
      res.status(422).render('shop/checkout', {
        path: 'cart/checkout',
        pageTitle: 'Checkout',
        products: products,
        totalSum: total,
        shippingInfo: shippingInfo,
        sessionId: session.id 
      });
  
    })
    .catch(err => {
    const error = new Error(err);
     error.httpStatusCode = 500; 
     return next(error);

    });
  
  };

exports.getCheckoutSuccess = (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {

      const products = user.cart.items.map(i => {
        return {quantity: i.quantity, size: i.size, product: { ...i.productId._doc }}
      }); 
      const order = new Order ({
        user: {
          userId: req.user 
        },
        products: products
    });
    order.save();
    })
    .then(result => {
      return req.user.clearCart();
      
    })
    .then(() =>{
      res.status(422).render('shop/success', {
          pageTitle: 'Order Confirmation',
          path: 'checkout/success',
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500; 
      return next(error);
      
    })
  };
  
  exports.postOrder = (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      console.log(user.cart.items);
      const products = user.cart.items.map(i => {
        return {quantity: i.quantity, size: i.size, product: { ...i.productId._doc }}
      }); 
      const order = new Order ({
        user: {
          userId: req.user 
        },
        products: products
    });
    order.save();
    })
    .then(result => {
      return req.user.clearCart();
      
    })
    .then(() =>{
      res.status(422).redirect('/shop');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500; 
      return next(error);
    })
  };
    
    
