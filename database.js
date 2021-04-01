const config = require('./config');
const fs = require('fs');

module.exports.fetchActivitiesSync = () => {
    const activityArray = JSON.parse(fs.readFileSync(config.activityFile));
    return new Map(activityArray.map(activity => [activity.id, activity]));
};

module.exports.registerParticipant = (participant, activity) => {
    return new Promise((resolve, reject) => {
        // Get participants list file path
        const listPath = `${config.participantFolder}list-${activity.name}-${activity.id}.json`;

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
};