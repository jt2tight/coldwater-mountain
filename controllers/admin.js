const mongodb = require('mongodb');
const Product = require('../models/products');


exports.getAddProduct = (req, res, next) => {

    Product.find(products => {
        res.render('admin/edit-product', {
            prods: products,
            pageTitle: 'Add Product',
            path:'/admin',
            editing: false,
            hasError: false,
            errorMessage: null
        });
    }).catch(err => {
        console.log(err)
    })
    
};

exports.postAddProduct = (req, res, next)=>{

    const title = req.body.title;
    const image = req.file;
    const description = req.body.description;
    const price = req.body.price;
    // if (!image) {
    //   return res.status(422).render('admin/edit-product', {
    //     pageTitle: 'Add Product',
    //     path: '/admin',
    //     editing: false,
    //     hasError: true,
    //     product: {
    //       title: title,
    //       price: price,
    //       description: description
    //     },
    //     errorMessage: 'Attached file is not an image.',
    //     validationErrors: []
    //   });
    // }
    // const errors = validationResult(req);
    
    // const imageUrl = image.path; 

    // if(!errors.isEmpty()){
    //   return res.status(422).render('admin/edit-product', {
    //     pageTitle: 'Add Product',
    //     path:'/admin/edit-product',
    //     editing: false,
    //     hasError: true,
    //     product: {
    //       title: title,
    //       imageUrl: imageUrl,
    //       price: price,
    //       description: description
    //     },
    //     errorMessage: errors.array()[0].msg
    // });

    // }

    const productImage = image.path; 
    const product = new Product({
        title: title,
        description: description, 
        price: price,
        image: productImage,

        });
    product.save((err,title)=> {
        if(err){
            throw new Error;
        }
        console.log(title);
    })
    // .then(result => {console.log('Created Product');
    res.redirect('/admin');
    // })
    // .catch(err => {
    //     console.log(err);
    //   const error = new Error(err);
    //   error.httpStatusCode = 500; 
    //   return next(error);;
    // });
};
