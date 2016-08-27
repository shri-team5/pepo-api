const { Router } = require('express');

const usersController = require('../controllers/users');

const router = Router();

router.get('/:id', usersController.getUser);
router.get('/vkontakte/:id', usersController.getUserByVkontakteId);
router.get('/facebook/:id', usersController.getUserByFacebookId);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);

module.exports = router;
