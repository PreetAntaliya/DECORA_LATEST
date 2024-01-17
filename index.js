const express = require('express');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const port = 8000;

const app = express();

app.set('view engine', 'ejs');

const localpassport = require('./model/localpassport');

const db = require('./config/mongoose');

app.use(
    session({
        name: 'decora',
        secret: 'decora',
        saveUninitialized: true,
        resave: true,
        cookie: {
            maxAge: 1000 * 60 * 60
        }
    })
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthentication);

app.use('/api', require('./routes/api'));
app.use('/', require('./routes/index'));

app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return false;
    }
    console.log("Server is listening on port:", port);
});
