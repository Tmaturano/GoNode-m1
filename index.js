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
  if (req.query.nomeUsuario === undefined || req.query.nomeUsuario === '') {
    res.redirect('/');
  } else {
    next();
  }
};

app.get('/major', usuarioPossuiNomeMiddleware, (req, res) => {
  const { nomeUsuario } = req.query;

  res.send(`Parabéns ${nomeUsuario}, você tem mais que 18 anos.`);
});

app.get('/minor', usuarioPossuiNomeMiddleware, (req, res) => {
  const { nomeUsuario } = req.query;

  res.send(`Que pena ${nomeUsuario}, você tem menos que 18 anos.`);
});

app.post('/check', (req, res) => {
  const { dataNascimentoUsuario, nomeUsuario } = req.body;

  const idadeUsuario = moment().diff(moment(dataNascimentoUsuario, 'DD/MM/YYYY'), 'years');

  if (idadeUsuario > 18) {
    res.redirect(`/major?nomeUsuario=${nomeUsuario}`);
  } else {
    res.redirect(`/minor?nomeUsuario=${nomeUsuario}`);
  }
});

app.listen(3000);
