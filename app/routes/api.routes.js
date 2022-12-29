var express = require('express');
var router = express.Router();

const twitterController = require('../controllers/twitter.controller');

router.get('/twitter/getTwitterAnalysis', twitterController.index);

module.exports = router;
