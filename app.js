const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { csrfSync } = require("csrf-sync");
var flash = require('connect-flash');





const urlModel = require('./models/url.models');
const urlRoute = require('./routes/url.routes');


const app = express();

const { csrfSynchronisedProtection } = csrfSync({
    getTokenFromRequest: (req) => req.body['CSRFToken'],
});

app.set('view engine', 'ejs');
app.set('views', 'views');



app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://itssai91:xtXav3NHtsL8pZ5L@cluster0.mdmkz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
        dbName: 'urlShortener'
    })
}))
app.use(flash());

app.use(express.static(path.join(__dirname, 'public', 'assets')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(csrfSynchronisedProtection);
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});
app.use(urlRoute);




mongoose.connect('mongodb+srv://itssai91:xtXav3NHtsL8pZ5L@cluster0.mdmkz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    {
        dbName: 'urlShortener',
    }
).then(() => {
    app.listen(3000);
    console.log('http://localhost:3000');
}).catch(err => {
    console.log(err);
})