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
    currentActivities = JSON.parse(fs.readFileSync(activityFile));
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
        activities: currentActivities,
        baseUrl: `${req.protocol}://${req.hostname}/form/`
    });
});
app.get('/form/', (req, res) => {
    res.send(`A link ID must be specified`);
});
app.get('/form/:id', (req, res) => {
    const activityIndex = currentActivities.reduce((actIndex, activity, index) => {
        if (activity.name === req.params.id)
            return index;
        else return actIndex;
    }, -1);

    if (activityIndex < 0) {
        res.send('Cette activité n\'existe plus');
        return;
    }

    const activity = currentActivities[activityIndex];

    res.render('form', {
        activityName: activity.name,
        teamActivity: activity.teamActivity
    });
});
app.post('/form/:activityName', (req, res) => {
    registerParticipant({
        firstName: req.fields.firstName,
        lastName: req.fields.lastName,
        sector: req.fields.sector,
        team: req.fields.team !== undefined ? req.fields.team : 'none'
    }, req.params.activityName);
    res.send(`Formulaire ${req.params.activityName} envoyé avec succès`);
});
// server
const server = app.listen(port, host, () => {
    console.log(`Server is now listenning on ${server.address().address}:${server.address().port}`);
});