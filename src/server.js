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
  if (process.env.NODE_ENV !== 'production') {
    console.info(
      `You can now view bullet-echo-server in the browser. \n\n http://localhost:${config.port} \n`
    );
    return;
  }
  console.info(
    `
---------------------------------------------------------
[      Bullet-Echo-Server is now running.       ]
---------------------------------------------------------
  `
  );
});
