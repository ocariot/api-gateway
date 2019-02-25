const gateway = require('express-gateway');
const path = require('path');
const dotenv = require('dotenv');

dotenv.load();


gateway()
        .load(path.join(__dirname, 'config'))
        .run();