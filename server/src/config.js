const path = require('path');

const config = {
   'PORT': 8080,
   'LOG_FILE': path.join(__dirname, 'logs', 'log.json'),
   'LIMIT': 10
};

module.exports = config;