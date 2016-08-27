const { Router } = require('express');

const tweetsController = require('../controllers/tweets');

const router = Router();

router.get('/', tweetsController.getFeed);
router.get('/world', tweetsController.getWorldFeed);
router.post('/', tweetsController.createTweet);

module.exports = router;
