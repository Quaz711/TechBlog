const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
    User.findAll({
        attributes: {
            exclude: ['paasword']
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
                attributes: ['id', 'title', 'postText', 'created']
            },

            {
                model: Comment,
                attributes: ['id', 'commenttext', 'created'],
                include: {
                    model: Post, 
                    attributes: ['title']
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
        email: req.body.email,
        password: req.body.password
    }).then(userData => {
        req.session.save(() => {
            req.session.userID = userData.id;
            req.session.username = userData.username;
            req.session.loggedIn = true;
            res.json(userData);
        });
    });
});

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(userData => {
        if (!userData) {
            res.status(400).json({ message: 'No user with this email was found' });
            return;
        }

        const correctPass = userData.checkPassword(req.body.password);

        if (!correctPass) {
            res.status(400).json({ message: 'Password entered was incorrect' });
            return;
        }

        req.session.save(() => {
            req.session.userID = userData.id;
            req.session.username = userData.username;
            req.session.loggedIn = true;
            res.json({ user: userData, message: 'Log in was successful'});
        });
    });
});

router.post('/logout', withAuth, (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    }

    else {
        res.status(404).end();
    }
});

router.put('/:id', withAuth, (req, res) => {
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

router.delete('/:id', withAuth, (req, res) => {
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