import { Request, Response } from 'express';
import argon2 from 'argon2';
import axios from 'axios';
import { addUser, getUserByEmail } from '../models/UserModel';
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
  const { email, password } = req.body as AuthRequest;

  const user = await getUserByEmail(email);

  // Check if the user account exists for that email
  if (!user) {
    res.sendStatus(404); // 404 Not Found (403 Forbidden would also make a lot of sense here)
    return;
  }

  // The account exists so now we can check their password
  const { passwordHash } = user;

  // If the password does not match
  if (!(await argon2.verify(passwordHash, password))) {
    res.sendStatus(404); // 404 Not Found (403 Forbidden would also make a lot of sense here)
    return;
  }

  // The user has successfully logged in
  res.sendStatus(200);
}

async function printCryptoCurrencies(): Promise<void> {
  let response: any = null;

  const fetchData = async () => {
    try {
      response = await axios.get(
        'https://pro-api.coinmarketcap.com/cryptocurrency/listings/latest',
        // 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', // dummy
        {
          headers: {
            'X-CMC_PRO_API_KEY': '465927fa-933b-4370-abd4-99439d5a1f40',
            // 'X-CMC_PRO_API_KEY': 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c', // dummy
          },
        }
      );
    } catch (ex) {
      response = null;
      // error
      console.log(ex);
      throw ex;
    }
    if (response) {
      // success
      const json = response.data;
      console.log(json);
      return json;
    }
  };

  fetchData();
}
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

export { registerUser, logIn, printCryptoCurrencies };
