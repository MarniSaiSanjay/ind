const express = require("express");
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override'); 
const session = require('express-session');

// for passport
const passport = require('passport');
const LocalStrategy = require('passport-local');


const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connect MongoDB at default port 27017.
mongoose.connect('mongodb://localhost:27017/indulge', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.')
    } else {
        console.log('Error in DB connection: ' + err)
    }
});


const Intern = require('./models/intern');

app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, "views"));


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// for passport:
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

const hrUser = require('./models/hr');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(hrUser.authenticate()));

passport.serializeUser(hrUser.serializeUser());
passport.deserializeUser(hrUser.deserializeUser());

const {isLoggedIn} = require('./middleware');

// Authentication:
app.use('/users', require('./routes/auth'));

app.get('/home', isLoggedIn, async (req,res) =>{
    const interns = await Intern.find();
    res.render('hr/home', {interns});
})

// form
app.get('/hr/add', isLoggedIn, (req,res) => {
    res.render('hr/add');
})


// Create(add to db)
app.post('/hr/add', isLoggedIn, async(req,res) => {
    var {name, stipend} = req.body;
    // stipend = 'k';
        const newIntern = new Intern({name, stipend});
        await newIntern.save();
        // res.send(newIntern);
        res.redirect('/home');
})

app.get('/hr/:id', async(req,res) => {
    const {id} = req.params;
    const intern = await Intern.findById(id);
    res.render('hr/edit', {intern});
})

// Update
app.put('/hr/:id', async(req,res)=>{
    const {id} = req.params;
    const {name, stipend} = req.body;
    await Intern.findByIdAndUpdate(req.params.id, {name, stipend});
    // res.send('Updated');
    res.redirect('/home');
});

// Delete

app.delete('/hr/:id', async(req,res) => {
    const {id} = req.params;
    await Intern.findByIdAndDelete(id);
    res.redirect('/home');
})

const port = 3000;
app.listen(port);