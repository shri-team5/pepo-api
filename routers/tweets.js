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

const tweetsController = require('../controllers/tweets');

const router = Router();

router.get('/', tweetsController.getFeed);
router.get('/v2/', tweetsController.getTweets);
router.get('/world', tweetsController.getWorldFeed);
router.get('/:tweetId', tweetsController.getTweet);
router.get('/:tweetId/replies', tweetsController.getReplies);
router.post('/', upload.single('image'), tweetsController.createTweet);

module.exports = router;
