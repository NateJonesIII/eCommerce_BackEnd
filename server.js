const express = require('express');
const routes = require('./routes');
// import sequelize connection
const session = require("express-session");
const sequelize = require("./config/connection");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

const SequelizeStore = require("connect-session-sequelize")(session.Store);

//session to secure server connection
const sess = {
  secret: "sec1234!JoJo",
  cookie: {
    expires: 10 * 60 * 1000,
  },
  resave: true,
  rolling: true,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

//use the sequelize session
app.use(session(sess));

// sync sequelize models to the database, then turn on the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening ON http://localhost:${PORT}`));
});