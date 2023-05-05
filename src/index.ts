import './config'; // Load environment variables
import 'express-async-errors'; // Enable default error handling for async errors
import express, { Express } from 'express';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';

import {
  registerUser,
  logIn,
  logOut,
  addBalance,
  calcProfit,
  sortedProfit,
} from './controllers/UserController';
import { renderCoinsPage, renderChartPage } from './controllers/CryptoController';
import { buyCrypto, sellCrypto } from './controllers/TransactionController';
import { validateNewUserBody, validateLoginBody } from './validators/authValidator';

const app: Express = express();
app.set('view engine', 'ejs');
const { PORT, COOKIE_SECRET } = process.env;

const SQLiteStore = connectSqlite3(session);

app.use(express.static('public', { extensions: ['html'] }));

app.use(
  session({
    store: new SQLiteStore({ db: 'sessions.sqlite' }),
    secret: COOKIE_SECRET,
    cookie: { maxAge: 8 * 60 * 60 * 1000 }, // 8 hours
    name: 'session',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/register', validateNewUserBody, registerUser); // Create an account
app.post('/login', validateLoginBody, logIn); // Log in to an account

app.get('/crypto', (req, res) => {
  res.redirect('/crypto');
});

app.get('/login', logOut);

app.get('/coinsPage', renderCoinsPage);

app.post('/buyCrypto', buyCrypto);
app.post('/sellCrypto', sellCrypto);

app.get('/addBalance', addBalance);
app.post('/addBalance', addBalance);

app.get('/profits', calcProfit);
app.get('/leaderBoard', sortedProfit);

// app.get('/chart', (req, res) => {
//   res.render('../views/chartPage');
// });

app.get('/chart', renderChartPage);

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
