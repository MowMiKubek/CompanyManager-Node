const { port } = require('./config.js')
const app = require('./app');


app.listen(port, () => {
  console.log(`Aplikacja dziala na porcie ${port}`)
});
