const express = require('express');
const routes = require('..1st Pull/controllers');
const sequelize = require('../config/connection');
const path = require('path');
const helpers = require('../utils/helpers');
const xpressHbs = require('express-handlebars');
const hbs = xpressHbs.create({helpers});
const xpressSession = require('express-session');
const app = express();
const PORT = process.env.PORT || 3001;
const SequelizeStore = require('connect-session-sequelize')(xpressSession.Store);

const session = {
    secret: "this is a secret",
    cookie: { originalMaxAge: 600000 },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(xpressSession(session));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});