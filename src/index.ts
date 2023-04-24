import './config'; // Load environment variables
import 'express-async-errors'; // Enable default error handling for async errors
import express, { Express } from 'express';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';

import { registerUser, logIn, logOut, addBalance } from './controllers/UserController';
import { addCryptoCurrency, renderCoinsPage } from './controllers/CryptoController';
import { buyCrypto, sellCrypto } from './controllers/TransactionController';

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

app.post('/api/users', registerUser); // Create an account
app.post('/login', logIn); // Log in to an account

app.get('/login', logOut);
app.get('/addCryptoPage', (req, res) => {
  res.render('addCryptoPage');
});

app.post('/api/addCryptoCurrency', addCryptoCurrency);

app.get('/coinsPage', renderCoinsPage);
// app.get('/api/printCryptoCurrencies', printCryptoCurrencies);

// app.post('/api/buyCrypto', BuyCrypto);
app.post('/coins/:slug', buyCrypto);

app.post('/api/sellCrypto', sellCrypto);

app.post('/api/addBalance', addBalance);

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
