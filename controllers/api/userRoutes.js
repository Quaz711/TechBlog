const router = require('express').Router();
const { Comment, Post, User } = require('../../models');

router.get('/', (req, res) => {
    User.findAll({
        attributes: {
            exclude: ['password']
        }
    }).then(userData => res.json(userData)).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
    User.findOne({
        attributes: {
            exclude: ['password']
        },
        
        where: {
            id: req.params.id
        },

        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_text', 'created_at']
            },

            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post, 
                    attributes: ['title', 'post_id']
                }
            }
        ]
    }).then(userData => {
        if (!userData) {
            res.status(404).json({ message: 'No user with this id was found' });
            return;
        }

        res.json(userData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password
    }).then(userData => {
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.username = userData.username;
            req.session.loggedIn = true;
            res.json(userData);
        });
    });
});

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(userData => {
        if (!userData) {
            res.status(400).json({ message: 'No user with this username was found' });
            return;
        }

        const correctPass = userData.checkPassword(req.body.password);

        if (!correctPass) {
            res.status(400).json({ message: 'Password entered was incorrect' });
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.username = userData.username;
            req.session.loggedIn = true;
            res.json({ user: userData, message: 'Log in was successful'});
        });
    });
});

router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    }

    else {
        res.status(404).end();
    }
});

router.put('/:id', (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    }).then(userData => {
        if (!userData) {
            res.status(404).json({ message: 'No user with this id was found' });
            return;
        }

        res.json(userData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    }).then(userData => {
        if (!userData) {
            res.status(404).json({ message: 'No user with this id was found' });
            return;
        }

        res.json(userData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;