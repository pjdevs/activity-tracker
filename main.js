// Modules
const express = require('express');
const formidable = require('express-formidable');
const morgan = require('morgan');
const fs = require('fs');

// Constants
const participantFolder = 'participants/';
const activityFile = './activities.json'
const host = '';
const port = 80;
const app = express();

// Database like stuff
let currentActivity;

function fetchActivity() {
    currentActivity = JSON.parse(fs.readFileSync(activityFile));
}

function registerParticipant(participant) {
    const listPath = `${participantFolder}list-${currentActivity.name}.json`;

    if (!fs.existsSync(listPath)) {
        fs.writeFileSync(listPath, JSON.stringify([]));
    }

    const participantList = JSON.parse(fs.readFileSync(listPath));
    participantList.push(participant);

    fs.writeFileSync(listPath, JSON.stringify(participantList));
}

fetchActivity();

// 1pp setup
app.set('view engine', 'ejs');

// 1pp midlewares
app.use(morgan('common'));
app.use(express.static(__dirname + "/static"));
app.use(formidable());

// App routes
app.get('/', (req, res) => {
    fetchActivity();
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
    registerParticipant({
        firstName: req.fields.firstName,
        lastName: req.fields.lastName,
        sector: req.fields.sector,
        team: req.fields.team !== undefined ? req.fields.team : 'none'
    });
    res.send(`Formulaire ${req.params.id} envoyé avec succès`);
});
// server
const server = app.listen(port, host, () => {
    console.log(`Server is now listenning on ${server.address().address}:${server.address().port}`);
});