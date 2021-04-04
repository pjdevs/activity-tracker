// Modules
const express = require('express');
const formidable = require('express-formidable');
const morgan = require('morgan');
const auth = require('./auth');
const config = require('./config');
const { fetchActivitiesSync, registerParticipant} = require('./database');

// Database like activities
let currentActivities = fetchActivitiesSync();

// App
const app = express();

// App setup
app.set('view engine', 'ejs');

// App midlewares
app.use(morgan('common'));
app.use(express.static(__dirname + "/static"));
app.use(formidable());
app.use(auth('/'));

// App routes
app.get('/', (req, res) => {
    currentActivities =  fetchActivitiesSync();

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
        res.send(`Erreur: L'activité ${req.params.id} n'existe pas`);
        return;
    }

    const participant = {
        firstName: req.fields.firstName,
        lastName: req.fields.lastName,
        sector: req.fields.sector,
        team: req.fields.team !== undefined ? req.fields.team.toLocaleLowerCase() : 'none',
        contact: req.fields.contact
    };

    registerParticipant(participant, activity)
    .then(() => {
        console.log("Registered participant :");
        console.log(participant);
        res.send(`Formulaire ${activity.name} envoyé avec succès`);
    })
    .catch((err) => {
        console.log('Error:');
        console.log(err);
        res.send('Erreur: Ce fomulaire n\'a pas été validé. Vous devez déjà être enregistré.');
    });
});

// Server
const server = app.listen(config.port, config.host, () => {
    console.log(`Server is now listenning on ${server.address().address}:${server.address().port}`);
});