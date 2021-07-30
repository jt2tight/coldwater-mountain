const Message = require('../models/messages');
const NewsLetter = require('../models/newsletter');
const { validationResult } = require('express-validator/check')

exports.getContact = (req, res, next) => {
    res.status(422).render('contact', {
        path:"/contact",
        pageTitle: "Contact",
        errorMessage: req.flash('error')
    })
};

exports.postContact = (req,res,next) => {
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).render('contact',{
            pageTitle: 'Contact', 
            path: '/contact',
            errorMessage: errors.array()[0].msg

        });
    }
    
    const newMessage = new Message({
            email: email,
            subject: subject,
            message: message
        })
    
    newMessage.save((err,message)=> {
        if(err){
            throw new Error;
        }

    })
        

    res.redirect('message-sent');
   
};

exports.getMessageConfirmation = (req,res,next) => {
    res.render('message-sent', {
        pageTitle: 'Message Sent',
        path:"/message-sent"
    })
};

exports.getVolunteer = (req,res,next) => {
    res.status(422).render('volunteer', {
        pageTitle: 'Volunteer',
        path:"/trail-system/volunteer",
        errorMessage: req.flash('error')
    })
};

exports.postVolunteer = (req,res,next) => {
    const email = req.body.email; 
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).render('volunteer',{
            pageTitle: 'Volunteer', 
            path: '/trail-system/volunteer',
            errorMessage: errors.array()[0].msg

        });
    }

    const newVolunteer = new NewsLetter({
        email: email 
    })

    newVolunteer.save(); 

    res.status(422).redirect('/about/volunteer-submit');

}

exports.getVolunteerSubmit = (req,res,next) => {
    res.status(422).render('volunteer-submit', {
        pageTitle: 'Email Submitted',
        path:"/about/volunteer-submit"
    })
}