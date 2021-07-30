exports.getCampsiteBooking = (req, res, next) => {
    // req.session.pageHome = true; 
    res.render('views/book-site',{
        path:'/booking',
        pageTitle:'Book a Campsite',
        // errorMessage: req.flash('error')
        
    })

};