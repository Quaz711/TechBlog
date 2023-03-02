const express = require('express');
const routes = require('./controllers');
const sql = require('./config/connections');
const path = require('path');
const helpers = require('./utils/helpers');
const xpressHbs = require('express-handlebars');
const hbs = xpressHbs.create({helpers});
const xpressSession = require('express-session');
const app = express();
const PORT = process.env.PORT || 3001;
const SqlStore = require('connect-session-sequelize')(xpressSession.Store);

const session = {
    secret: "this is a secret",
    cookie: { originalMaxAge: 600000 },
    resave: false,
    saveUnintialized: true,
    store: new SqlStore({
        db: sql
    })
};

app.use(xpressSession(session));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(routes);
sql.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});