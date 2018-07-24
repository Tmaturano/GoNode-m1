const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('main');
});

const usuarioPossuiNomeMiddleware = (req, res, next) => {
  const { nomeUsuario } = req.query;
  return !nomeUsuario ? res.redirect('/') : next();
};

app.get('/major', usuarioPossuiNomeMiddleware, (req, res) => {
  const { nomeUsuario } = req.query;

  res.render('major', { nomeUsuario });
});

app.get('/minor', usuarioPossuiNomeMiddleware, (req, res) => {
  const { nomeUsuario } = req.query;

  res.render('minor', { nomeUsuario });
});

app.post('/check', (req, res) => {
  const { dataNascimentoUsuario, nomeUsuario } = req.body;
  const idadeUsuario = moment().diff(moment(dataNascimentoUsuario, 'DD/MM/YYYY'), 'years');

  return idadeUsuario >= 18
    ? res.redirect(`/major?nomeUsuario=${nomeUsuario}`)
    : res.redirect(`/minor?nomeUsuario=${nomeUsuario}`);
});

app.listen(3000);
