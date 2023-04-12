import { Request, Response } from 'express';
import { parseDatabaseError } from '../utils/db-utils';

import { addCrypto } from '../models/CryptoModel';

async function addCryptoCurrency(req: Request, res: Response): Promise<void> {
  const { cryptoType, value } = req.body as CryptoAuth;

  try {
    await addCrypto(cryptoType, value);

    // console.log(newCrypto);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

export { addCryptoCurrency };
