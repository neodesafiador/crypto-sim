import { Request, Response } from 'express';
import argon2 from 'argon2';
// import axios from 'axios';
import { addMinutes, isBefore, parseISO, formatDistanceToNow } from 'date-fns';
import { addUser, getUserByEmail } from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';
// import { CryptoCurrency } from '../entities/CryptoCurrency';

async function registerUser(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as AuthRequest;

  const passwordHash = await argon2.hash(password);
  console.log(passwordHash);

  try {
    await addUser(email, passwordHash);
    // res.sendStatus(201);
    res.redirect('/crypto');
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function logIn(req: Request, res: Response): Promise<void> {
  console.log(req.session);

  const now = new Date();
  const logInTimeout = parseISO(req.session.logInTimeout);
  if (logInTimeout && isBefore(now, logInTimeout)) {
    const timeRemaining = formatDistanceToNow(logInTimeout);
    const message = `You have ${timeRemaining} remaining.`;
    res.status(429).send(message); // 429 Too Many Requests
    return;
  }

  const { email, password } = req.body as AuthRequest;

  const user = await getUserByEmail(email);

  if (!user) {
    res.sendStatus(404); // 404 Not Found (403 Forbidden would also make a lot of sense here)
    return;
  }

  const { passwordHash } = user;

  if (!(await argon2.verify(passwordHash, password))) {
    if (!req.session.logInAttempts) {
      req.session.logInAttempts = 1;
    } else {
      req.session.logInAttempts += 1;
    }

    if (req.session.logInAttempts >= 5) {
      const threeMinutesLater = addMinutes(now, 3).toISOString();
      req.session.logInTimeout = threeMinutesLater;
      req.session.logInAttempts = 0;
    }

    res.sendStatus(404); // 404 Not Found - user with email/pass doesn't exist
    return;
  }

  await req.session.clearSession();

  req.session.authenticatedUser = {
    userId: user.userId,
    email: user.email,
  };
  req.session.isLoggedIn = true;
  // res.sendStatus(201);
  res.redirect('/crypto');
}

async function logOut(req: Request, res: Response): Promise<void> {
  req.session.isLoggedIn = false;

  res.redirect('/login');
}

// async function printCryptoCurrencies(): Promise<void> {
//   let response: any = null;

//   const fetchData = async () => {
//     try {
//       response = await axios.get(
//         'https://pro-api.coinmarketcap.com/cryptocurrency/listings/latest',
//         // 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', // dummy
//         {
//           headers: {
//             'X-CMC_PRO_API_KEY': '465927fa-933b-4370-abd4-99439d5a1f40',
//             // 'X-CMC_PRO_API_KEY': 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c', // dummy
//           },
//         }
//       );
//     } catch (ex) {
//       response = null;
//       // error
//       console.log(ex);
//       throw ex;
//     }
//     if (response) {
//       // success
//       const json = response.data;
//       console.log(json);
//       return json;
//     }
//   };

//   fetchData();
// }
// async function printCryptoCurrencies(query: CryptoCurrency): Promise<CryptoCurrency> {
//   const url = new URL('https://pro-api.coinmarketcap.com/cryptocurrency/listings/latest');
//   url.search = new URLSearchParams(query).toString();
//   // const headers = {
//   //   'x-api-key': 'X-CMC_PRO_API_KEY',
//   //   'x-api-secret': '465927fa-933b-4370-abd4-99439d5a1f40',
//   //   'x-rapidapi-host': 'crypto-asset-market-data-unified-apis-for-professionals.p.rapidapi.com',
//   //   'x-rapidapi-key': 'REPLACE_THIS_WITH_YOUR_KEY',
//   // };
//   const headers = {
//     'X-CMC_PRO_API_KEY': '465927fa-933b-4370-abd4-99439d5a1f40',
//     // 'X-CMC_PRO_API_KEY': 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c', // dummy
//   };
//   const response = await fetch(url.toString(), { headers });
//   return response.json();
// }

// const query = {
//   asset: 'BTC',
//   exchange: 'Kraken',
//   denominator: 'USD',
// };

// (async () => {
//   const data = await printCryptoCurrencies(query);
//   console.log(data);
// })();

export { registerUser, logIn, logOut };
