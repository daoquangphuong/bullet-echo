process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
  // send entire app down. Process manager will restart it
  process.exit(1);
});

const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { PORT } = require('./constants');

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

app.listen(PORT, () => {
  console.info(
    `You can now view in the browser. \n\n http://localhost:${PORT} \n`
  );
});
