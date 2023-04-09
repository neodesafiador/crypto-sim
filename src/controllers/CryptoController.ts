import { Request, Response } from 'express';
import { parseDatabaseError } from '../utils/db-utils';
import { updateBuyUserBalance, getUserByID } from '../models/UserModel';

import { updateBuyCryptoBalance, getCryptoByType, addCrypto } from '../models/CryptoModel';

async function addCryptoCurrency(req: Request, res: Response): Promise<void> {
  const { authenticatedUser } = req.session;
  const user = getUserByID(authenticatedUser.userId);

  const { cryptoType, value } = req.body as CryptoAuth;

  try {
    await addCrypto(cryptoType, value, await user);

    // console.log(newCrypto);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function buyCryptoCurrency(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.session.authenticatedUser;
    const { cryptoType, quantity } = req.body as CryptoRequest;
    const user = await getUserByID(userId);
    const crypto = await getCryptoByType(cryptoType);

    if (!user) {
      res.sendStatus(404).json('User Not Found');
      return;
    }
    if (!req.session.isLoggedIn) {
      res.sendStatus(401).json('User is Not Logged In');
      return;
    }
    if (!crypto) {
      res.sendStatus(403).json('Crypto Not Found');
      return;
    }

    // Calculate total cost of crypto being bought
    const totalCost = quantity * crypto.value;

    // Check if user has enough money to buy
    if (user.balance < totalCost) {
      res.sendStatus(402).json('User does not have enough money to buy');
      console.error('User does not have enough money to buy');
      return;
    }

    // Update user balance and profit
    updateBuyUserBalance(user, totalCost, quantity);

    // Update user crypto balance
    updateBuyCryptoBalance(crypto);

    console.log(`Bought ${quantity} ${crypto.cryptoType} for $${totalCost}`);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.sendStatus(500).json(databaseErrorMessage);
  }
}

// TODO: function for sell crypto

export { addCryptoCurrency, buyCryptoCurrency };
