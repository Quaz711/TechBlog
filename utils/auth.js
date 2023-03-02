const withAuth = (req, res, next) => {
    if (!req.session.user_id) {
        req.redirect('/login');
    }

    else {
        next();
    }
};

module.exports =withAuth;