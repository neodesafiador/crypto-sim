import { Request, Response } from 'express';
import { parseDatabaseError } from '../utils/db-utils';
import { updateBuyUserBalance, getUserByID } from '../models/UserModel';

import { getCryptoByType } from '../models/CryptoModel';

import { getWalletById, updateBuyWallet } from '../models/WalletModel';

async function BuyCrypto(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.session.authenticatedUser;
    const { cryptoType, quantity } = req.body as CryptoRequest;
    const user = await getUserByID(userId);
    const crypto = await getCryptoByType(cryptoType);
    const wallet = await getWalletById(userId);

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

    const totalCost = quantity * crypto.value;

    if (user.balance < totalCost) {
      res.sendStatus(400).json('User does not have enough money to buy');
      console.error('User does not have enough money to buy');
      return;
    }

    updateBuyWallet(wallet, quantity);
    updateBuyUserBalance(user, totalCost);

    console.log(`Bought ${wallet.amount} ${crypto.cryptoType} for $${totalCost}`);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.sendStatus(500).json(databaseErrorMessage);
  }
}

export { BuyCrypto };
