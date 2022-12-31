var express = require('express');
var router = express.Router();

const twitterController = require('../controllers/twitter.controller');

router.get('/twitter/getTwitterAnalysis', twitterController.index);
router.get('/twitter/getTrendingHashtags',twitterController.getTrendingHashtags);

module.exports = router;
