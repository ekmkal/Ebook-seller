const express = require('express');
const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

// Handlebars middlevare
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set static folder
app.use(express.static(`${__dirname}/public`));

// Index route
app.get('/', (req, res) => {
    res.render('index', {
        stripePublishableKey: keys.stripePublishableKey
    });
})

// Charge route
app.post('/charge', (req, res) => {
    const amount = 1700;

    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
    .then(customer => {
        stripe.charges.create({
            amount,
            description: 'Web dev e-book',
            currency: 'eur',
            customer: customer.id
        })
    })
    .then(charge => res.render('success'))
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});