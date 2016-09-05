const { Router } = require('express');

const multer = require('multer');
const upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'tmp/')
        },
        filename: function(req, file, cb) {
            cb(null, Date.now() + '_' + file.originalname)
        }
    })
});

const usersController = require('../controllers/users');

const router = Router();

router.get('/:id', usersController.getUser);
router.put('/:id', upload.single('image'), usersController.updateUser);
router.get('/username/:username', usersController.getUserByUsername);
router.get('/vkontakte/:id', usersController.getUserByVkontakteId);
router.get('/facebook/:id', usersController.getUserByFacebookId);
router.post('/', usersController.createUser);
router.post('/subscribe/:user_id', usersController.subscribe);
router.post('/unsubscribe/:user_id', usersController.unsubscribe);

module.exports = router;
