const { Router } = require('express');

const usersController = require('../controllers/users');

const router = Router();

router.get('/:id', usersController.getUser);
router.put('/', usersController.createUser);

module.exports = router;
