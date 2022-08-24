const express = require('express');
const { port } = require('./config.js')
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');

const app = express();

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/../views'));

// set layout
app.use(ejsLayouts);
app.set('layout', 'layouts/main');

// public folder
app.use(express.static('public'));

// middleware passing URL to render engine
app.use('/', require('./middleware/view-variables'))

// set up routes (this must be here, after setting up views etc.)
app.use(require('./routes/web'));

app.listen(port, () => {
  console.log(`Aplikacja dziala na porcie ${port}`)
});
