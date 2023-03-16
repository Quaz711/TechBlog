const router = require('express').Router();
const { Comment, Post, User } = require('../models');

router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'post_text', 'title', 'created_at'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
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
        const posts = postData.map(postTemp => postTemp.get({ plain: true }));

        res.render('homepage', { posts, loggedIn: req.session.loggedIn });
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
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('signup');
});

router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        
        attributes: ['id', 'post_text', 'title', 'created_at'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
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

        const post = postData.get({ plain: true });

        res.render('single', { post, loggedIn: req.session.loggedIn });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;