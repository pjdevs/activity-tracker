const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');



// vars
const host = '';
const port = 8080;
const app = express();

// app setup
app.set('view engine', 'ejs');

// app midlewares
app.use(morgan('common'));

// routes
app.get('/', (req, res) => {
    res.send('Link API is at /form/:id');
});
app.get('/form/', (req, res) => {
    res.send(`A link ID must be specified`);
});
app.get('/form/:id', (req, res) => {
    res.render('form', {
        formID: req.params.id
    });
});

// server
const server = app.listen(port, host, () => {
    console.log(`Server is now listenning on ${server.address().address}:${server.address().port}`);
});