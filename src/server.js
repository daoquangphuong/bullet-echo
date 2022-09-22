if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line global-require
  require('source-map-support').install();
}

const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const config = require('./config');

const app = express();

app.set('trust proxy', true);

app.get('/', (req, res) => {
  fs.createReadStream(path.resolve(__dirname, 'public', 'index.html')).pipe(
    res
  );
});

app.use(express.static(path.resolve(__dirname, 'public')));

app.use(
  '/',
  cors({
    origin: '*',
  }),
  routes
);

app.listen(config.port, () => {
  console.info(
    `You can now view in the browser. \n\n http://localhost:${config.port} \n`
  );
});
