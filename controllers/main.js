exports.getIndex = (req, res, next) => {    
    res.status(422).render('index',{
        path:'/',
        pageTitle:'Coldwater Mountain - Mountain Bike Adventure',
        // errorMessage: req.flash('error')
        
    })

};

exports.getTrails = (req, res, next) => {
    // req.session.pageHome = true; 
    res.status(422).render('trails',{
        path:'/trail-system',
        pageTitle:'Coldwater Mountain - Trail System',
        // errorMessage: req.flash('error')
        
    })

};

exports.getVisit = (req, res, next) => {
    res.status(422).render('visit', {
        path:"/visit",
        pageTitle: 'Visit Coldwater Mountain'
    })
};

exports.getAbout = (req, res, next) => {
    res.status(422).render('about', {
        pageTitle: 'About Coldwater',
        path:'/about'
    })
};

