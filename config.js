const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
});

module.exports = {
    NODE_ENV : process.env.NODE_ENV,
    HOST : process.env.HOST || 'localhost',
    PORT : process.env.PORT || 3000,
    APP_PATH : process.env.APP_PATH || ''
}