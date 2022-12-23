var express = require('express');
var router = express.Router();

const twitterController = require('../controllers/twitter.controller');

router.get('/twitter', twitterController.index);

module.exports = router;
