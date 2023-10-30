const config =  require('./config.js');
const express = require('express');
const path = require('path');
const app = express();

console.log(`NODE_ENV=${config.NODE_ENV}`);

// Serve the React static files
app.use('/cci-fulfillment', express.static(config.PATH));

// Fallback to React's index.html for other routes (if using React Router)
app.get('/cci-fulfillment/*', (req, res) => {
    res.sendFile(path.join(config.PATH, 'index.html'));
});

app.listen(config.PORT, config.HOST, () => {
    console.log(`Server ${config.HOST} is running on port ${config.PORT}`);
});
