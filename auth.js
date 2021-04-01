const config = require('./config');

module.exports = (url) => (req, res, next) => {
    if (url !== req.url)
        return next();

    // parse login and password from headers
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    // Verify login and password are set and correct
    if (login && password && login === config.login && password === config.password)
        return next(); // Access granted...

    // Access denied...
    res.set('WWW-Authenticate', 'Basic realm="Authentification requise"');
    res.status(401).send('Erreur: Authentification requise.');
};