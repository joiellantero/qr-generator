const express = require('express');
const path = require('path');

const app = express();

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.static(path.join(__dirname), {
  extensions: ['html'],
  dotfiles: 'deny',
}));

const port = 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});