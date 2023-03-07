const router = require('express').Router();
const { Comment, Post, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            userID: req.session.userID
        },

        attributes: ['id', 'postText', 'title', 'created'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'commentText', 'postID', 'userID', 'created'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },

            {
                model: User,
                attributes: ['username']
            }
        ]
    }).then(postData => {
        const postedData = postData.map(postTemp => postTemp.get({ plain: true }));

        res.render('dashboard', { postedData, loggedIn: true });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },

        attributes: ['id', 'postText', 'title', 'created'],
        include: [
            {
                model: User,
                attributes: ['username']
            },

            {
                model: Comment,
                attributes: ['id', 'commentText', 'postID', 'userID', 'created'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    }).then(postData => {
        const postedData = postData.get({ plain: true });

        res.render('edit-posts', { postedData, loggedIn: true });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/newpost', (req, res) => {
    res.render('new-post');
});

module.exports = router;