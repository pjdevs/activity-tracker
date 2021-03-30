const express = require('express');
const morgan = require('morgan');

// vars
const host = '';
const port = 80;
const app = express();

// db like
const currentActivity = {
    name: 'foot',
    teamActivity: true
};

// app setup
app.set('view engine', 'ejs');

// app midlewares
app.use(morgan('common'));
app.use(express.static(__dirname + "/static"))

// routes
app.get('/', (req, res) => {
    res.render('link', {
        formUrl: `${req.protocol}://${req.hostname}/form/${currentActivity.name}`
    });
});
app.get('/form/', (req, res) => {
    res.send(`A link ID must be specified`);
});
app.get('/form/:id', (req, res) => {
    res.render('form', {
        formID: req.params.id,
        activity: currentActivity.name,
        teamActivity: currentActivity.teamActivity
    });
});
app.post('/form/:id', (req, res) => {
    // do some register
    res.send(`Formulaire ${req.params.id} envoyé avec succès`);
});
// server
const server = app.listen(port, host, () => {
    console.log(`Server is now listenning on ${server.address().address}:${server.address().port}`);
});