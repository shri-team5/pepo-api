const { Router } = require('express');

const tweetsController = require('../controllers/tweets');

const router = Router();

router.get('/', tweetsController.get);

module.exports = router;
