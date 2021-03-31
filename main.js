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

function fetchActivitiesSync() {
    const activityArray = JSON.parse(fs.readFileSync(activityFile));
    return new Map(activityArray.map(activity => [activity.id, activity]));
}

function registerParticipant(participant, activity) {
    return new Promise((resolve, reject) => {
        // Get participants list file path
        const listPath = `${participantFolder}list-${activity.name}-${activity.id}.json`;

        // Check if file exists
        if (!fs.existsSync(listPath)) {
            fs.writeFileSync(listPath, JSON.stringify([]));
        }

        // Read file
        fs.readFile(listPath, async (err, data) => {
            if (err) return reject(err);

            const participantList = JSON.parse(data);

            // Check if participant already in list
            const isInList = await new Promise((inList) => {
                participantList.forEach(p => {
                    if (p.firstName === participant.firstName
                        && p.lastName === participant.lastName
                        && p.sector === participant.sector)
                        return inList(true);
                });

                return inList(false);
            });

            if (isInList)
                return reject('participant already registered');
            else participantList.push(participant);
    
            fs.writeFile(listPath, JSON.stringify(participantList), (err) => {
                if (err) return reject(err);
                else return resolve();
            });
        });
    });
}

currentActivities = fetchActivitiesSync();

// 1pp setup
app.set('view engine', 'ejs');

// 1pp midlewares
app.use(morgan('common'));
app.use(express.static(__dirname + "/static"));
app.use(formidable());

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

    registerParticipant({
        firstName: req.fields.firstName,
        lastName: req.fields.lastName,
        sector: req.fields.sector,
        team: req.fields.team !== undefined ? req.fields.team : 'none'
    }, activity)
    .then(() => {
        res.send(`Formulaire ${activity.name} envoyé avec succès`);
    })
    .catch((err) => {
        console.log('Error:');
        console.log(err);
        res.send('Erreur: Ce fomulaire n\'a pas été validé. Vous devez déjà être enregistré.');
    });
});
// server
const server = app.listen(port, host, () => {
    console.log(`Server is now listenning on ${server.address().address}:${server.address().port}`);
});