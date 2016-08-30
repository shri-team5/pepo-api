const { Router } = require('express');

const usersController = require('../controllers/users');

const router = Router();

router.get('/:id', usersController.getUser);
router.get('/username/:username', usersController.getUserByUsername);
router.get('/vkontakte/:id', usersController.getUserByVkontakteId);
router.get('/facebook/:id', usersController.getUserByFacebookId);
router.post('/', usersController.createUser);
router.post('/subscribe/:user_id', usersController.subscribe);
router.post('/unsubscribe/:user_id', usersController.unsubscribe);
router.put('/:id', usersController.updateUser);

module.exports = router;
