const { Router } = require('express');

const usersController = require('../controllers/users');

const router = Router();

router.get('/', usersController.get);

module.exports = router;
