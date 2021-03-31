function f() {
    return new Promise((resolve, reject) => {
        reject('error: caca');
        console.log('rejected !');

        resolve();
        console.log('resolved !');
    });
}

f().then(() => console.log('must not be displayed')).catch((err) => console.log(err));

(async () => {
    const participantInList = await new Promise((r) => {
        ['b', 'a'].forEach(p => {
            if (p === 'a')
                r(true);
        });

        r(false);
    });

    console.log(participantInList);
})();