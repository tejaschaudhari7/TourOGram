if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const appError = require('./utilities/expressErrors');
const methodOverride = require('method-override');
const destinationRoutes = require('./routes/destinations');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/user');
const session = require('express-session');
const passport = require('passport');
const localStratergy = require('passport-local');
const User = require('./models/user');
const { Session } = require('inspector');
const MongoStore = require('connect-mongo')(session);
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/Tour-O-Gram'
const secret = process.env.SECRET || 'confidential'

app.engine('ejs',ejsMate);

mongoose.connect(dbUrl)
const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection error"));
db.once('open',()=>{
    console.log('Database Connected')
})

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));

const store = new MongoStore({
    url : dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
})

store.on("error",function (e) {
    console.log("Session Store Error",e)
})

const sessionConfig = {secret , resave : false,saveUninitialized : true, 
      cookie : {expires : Date.now() + 1000 * 60 * 60 * 24 * 7, httpOnly : true},
      store
 };
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    //console.log(req.session)
    // if(!['/login','/'].includes(req.originalUrl)) {
    //     req.session.returnTo = req.originalUrl;
    // }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/destinations',destinationRoutes);
app.use('/destinations/:id/reviews',reviewRoutes);
app.use('/',userRoutes);

app.get('/',(req,res) => {
    res.render('home');
})

app.all('*',(req,res,next) => {
    next(new appError('Page Not Found',404));
})

app.use((err,req,res,next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Internal Server Error';
    res.status(statusCode).render('error',{err});
    //res.send('Something went wrong');
})

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Up and running on ${port}`);
})