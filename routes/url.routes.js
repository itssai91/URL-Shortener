const express = require('express');

const urlController = require('../controllers/url.controller');

const urlRoute = express.Router();

urlRoute.get('/', urlController.getLandingPage);
urlRoute.get('/dashboard', urlController.getDash);
urlRoute.get('/:token', urlController.redirectPage);

urlRoute.post('/', urlController.shortenUrl);
urlRoute.post('/dashboard', urlController.checkClicks);

urlRoute.use(urlController.errorHandling);

module.exports = urlRoute;