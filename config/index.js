switch(process.env.NODE_ENV || 'development') {
    case 'development':
        module.exports = require('./environments/development.js');
        break;
    case 'production':
        module.exports = require('./environments/production.js');
        break;
}
