const { Router } = require('express');

const tweetsController = require('../controllers/tweets');

const router = Router();

router.get('/', tweetsController.getFeed);
router.post('/', tweetsController.post);

module.exports = router;
