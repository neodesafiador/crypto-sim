import { Request, Response } from 'express';
import argon2 from 'argon2';
// import axios from 'axios';
import { addMinutes, isBefore, parseISO, formatDistanceToNow } from 'date-fns';
import { addUser, getUserByEmail, getUserById, updateEmailAddress } from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';
// import { CryptoCurrency } from '../entities/CryptoCurrency';

async function registerUser(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as AuthRequest;
  // const { email, firstName, lastName, password } = req.body as AuthRequest;
  // Hash the password
  const passwordHash = await argon2.hash(password);
  console.log(passwordHash);

  try {
    // Store the `passwordHash` and NOT the plaintext password
    const newUser = await addUser(email, passwordHash);
    // const newUser = await addUser(email, firstName, lastName, passwordHash);
    console.log(newUser);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function logIn(req: Request, res: Response): Promise<void> {
  console.log(req.session);

  const now = new Date();
  // NOTES: We need to convert the date string back into a Date() object
  //        `parseISO()` does the conversion
  const logInTimeout = parseISO(req.session.logInTimeout);
  // NOTES: If the client has a timeout set and it has not expired
  if (logInTimeout && isBefore(now, logInTimeout)) {
    // NOTES: This will create a human friendly duration message
    const timeRemaining = formatDistanceToNow(logInTimeout);
    const message = `You have ${timeRemaining} remaining.`;
    // NOTES: Reject their request
    res.status(429).send(message); // 429 Too Many Requests
    return;
  }

  const { email, password } = req.body as AuthRequest;

  const user = await getUserByEmail(email);

  // Check if the user account exists for that email
  if (!user) {
    res.sendStatus(404); // 404 Not Found (403 Forbidden would also make a lot of sense here)
    return;
  }

  // The account exists so now we can check their password
  const { passwordHash } = user;

  // // If the password does not match
  // if (!(await argon2.verify(passwordHash, password))) {
  //   res.sendStatus(404); // 404 Not Found (403 Forbidden would also make a lot of sense here)
  //   return;
  // }

  if (!(await argon2.verify(passwordHash, password))) {
    // NOTES: If they haven't attempted to log in yet
    if (!req.session.logInAttempts) {
      req.session.logInAttempts = 1; // NOTES: Set their attempts to one
    } else {
      req.session.logInAttempts += 1; // NOTES: Otherwise increment their attempts
    }

    // NOTES: If the client has failed five times then we will add a
    //        3 minute timeout
    if (req.session.logInAttempts >= 5) {
      const threeMinutesLater = addMinutes(now, 3).toISOString(); // NOTES: Must convert to a string
      req.session.logInTimeout = threeMinutesLater;
      req.session.logInAttempts = 0; // NOTES: Reset their attempts
    }

    res.sendStatus(404); // 404 Not Found - user with email/pass doesn't exist
    return;
  }

  // NOTES: Remember to clear the session before setting their authenticated session data
  await req.session.clearSession();

  // NOTES: Now we can add whatever data we want to the session
  req.session.authenticatedUser = {
    userId: user.userId,
    email: user.email,
  };
  req.session.isLoggedIn = true;

  // The user has successfully logged in
  res.sendStatus(200);
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

async function updateUserEmail(req: Request, res: Response): Promise<void> {
  const { targetUserId } = req.params as UserIdParam;

  // NOTES: Access the data from `req.session`
  const { isLoggedIn, authenticatedUser } = req.session;

  // NOTES: We need to make sure that this client is logged in AND
  //        they are try to modify their own user account
  if (!isLoggedIn || authenticatedUser.userId !== targetUserId) {
    res.sendStatus(403).json('Not loggedIn or Not authorized User'); // 403 Forbidden
    return;
  }

  const { email } = req.body as { email: string };

  // Get the user account
  const user = await getUserById(targetUserId);

  if (!user) {
    res.sendStatus(404).json('User not found'); // 404 Not Found
    return;
  }

  // Now update their email address
  try {
    await updateEmailAddress(targetUserId, email);
  } catch (err) {
    // The email was taken so we need to send an error message
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
    return;
  }

  res.sendStatus(200);
}

export { registerUser, logIn, updateUserEmail };
