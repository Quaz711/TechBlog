const router = require('express').Router();
const commentRoutes = require('./api/commentRoutes.js');
const postRoutes = require('./api/postRoutes.js');
const userRoutes = require('./api/userRoutes.js');

router.use('/comments', commentRoutes);
router.use('/posts', postRoutes);
router.use('/users', userRoutes);

module.exports = router;