const { Router } = require('express');

const tweetsController = require('../controllers/tweets');

const router = Router();

router.get('/', tweetsController.get);
router.post('/', tweetsController.post);

module.exports = router;
