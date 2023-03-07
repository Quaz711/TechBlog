const router = require('express').Router();
const { Comment, Post, User } = require('../models');

router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'posttext', 'title', 'created'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'commentText', 'postID', 'userID', 'created'],
                include: {
                    model:User,
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

        res.render('homepage', { postedData, loggedIn: req.session.loggedIn });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        
        attributes: ['id', 'postText', 'title', 'created'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'commenttext', 'postID', 'userID', 'created'],
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
        if (!postData) {
            res.status(404).json({ message: 'No post with this id was found' });
            return;
        }

        const postedData = postData.get({ plain: true });

        res.render('single-post', { post, loggedIn: req.session.loggedIn });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;