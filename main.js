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
let currentActivities;

function fetchActivities() {
    const activityArray = JSON.parse(fs.readFileSync(activityFile));
    currentActivities = new Map(activityArray.map(activity => [activity.id, activity]));
}

function registerParticipant(participant, activityName) {
    const listPath = `${participantFolder}list-${activityName}.json`;

    if (!fs.existsSync(listPath)) {
        fs.writeFileSync(listPath, JSON.stringify([]));
    }

    const participantList = JSON.parse(fs.readFileSync(listPath));
    participantList.push(participant);

    fs.writeFileSync(listPath, JSON.stringify(participantList));
}

fetchActivities();

// 1pp setup
app.set('view engine', 'ejs');

// 1pp midlewares
app.use(morgan('common'));
app.use(express.static(__dirname + "/static"));
app.use(formidable());

// App routes
app.get('/', (req, res) => {
    fetchActivities();
    res.render('link', {
        activities: [...currentActivities.values()],
        baseUrl: `${req.protocol}://${req.hostname}/form/`
    });
});
app.get('/form/:id', (req, res) => {
    const activity = currentActivities.get(req.params.id);

    if (activity === undefined) {
        res.send('Erreur: cette activité n\'existe pas');
        return;
    }

    res.render('form', {
        activityName: activity.name,
        teamActivity: activity.teamActivity
    });
});
app.post('/form/:id', (req, res) => {
    const activity = currentActivities.get(req.params.id);

    if (activity === undefined) {
        res.send(`Erreur: l'activité ${req.params.id} n'existe pas`);
        return;
    }

    registerParticipant({
        firstName: req.fields.firstName,
        lastName: req.fields.lastName,
        sector: req.fields.sector,
        team: req.fields.team !== undefined ? req.fields.team : 'none'
    }, activity.name);
    res.send(`Formulaire ${activity.name} envoyé avec succès`);
});
// server
const server = app.listen(port, host, () => {
    console.log(`Server is now listenning on ${server.address().address}:${server.address().port}`);
});