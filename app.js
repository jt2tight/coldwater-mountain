const express = require('express');
const ejs = require('ejs');


const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const csrf = require('csurf');
const flash = require('connect-flash');
const helmet = require('helmet');


const bookingRoutes = require('./routes/booking');
const mainRoutes = require('./routes/main');
const contactRoutes = require('./routes/contact');
const shopRoutes = require('./routes/shop')
const adminRoutes = require('./routes/admin');
const errorController = require('./controllers/error');

const mongoose = require('mongoose');
const MONGODB_URI = process.env.CONNECTION_STRING;

const session = require('express-session');
const User = require('./models/user');
const MongoDBStore = require('connect-mongodb-session')(session);

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/store');
    },
    filename: (req, file, cb) => {
      cb(null, getRandomNumber(0,1001) + '-' + file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };


const app = express();

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

const csrfProtection = csrf();

app.use(helmet({
  contentSecurityPolicy: false}));
app.use(bodyParser.urlencoded( { extended: false } ));

app.use(
    multer({ storage: fileStorage , fileFilter: fileFilter}).single('image')
  );

app.use(express.static(path.join(__dirname,'public')));

app.use(session
    ({
        secret: 'my secret', 
        // cookie: {
        //     maxAge: 1000 * 60 * 60 * 24 * 7// 1 week
        // },
        resave: true, 
        saveUninitialized: true, 
        store: store 
    })
);

app.use(csrfProtection);

app.use(flash());


app.use((req,res,next) => {
    if(!req.session.user){
        req.session.user = new User({
            _sessionId: req.session.id,
            

        })
        req.session.user.save();
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        req.user = user; 
        next();
    })
    .catch(err => {
        throw new Error(err);
    });

})

app.set('view engine', 'ejs');
app.set('views','views');

app.use((req,res,next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
})

app.use(mainRoutes);
app.use(bookingRoutes);
app.use(contactRoutes);
app.use(shopRoutes);
app.use(adminRoutes);

app.use('/500', errorController.get500);

app.use(errorController.get404);

app.use((err, req, res, next) => {
  res.redirect('/500');
})


mongoose.connect(MONGODB_URI)
.then(result => {
    app.listen(3500);
})
.catch(err => {
    console.log(err)
})