import { Request, Response } from 'express';
import { parseDatabaseError } from '../utils/db-utils';
import { updateBuyUserBalance, updateSellUserBalance, getUserByID } from '../models/UserModel';
import { getCryptoByType } from '../models/CryptoModel';
import {
  addWallet,
  updateBuyWallet,
  updateSellWallet,
  getWalletByUserId,
  getWalletById,
} from '../models/WalletModel';

async function getWallet(req: Request, res: Response): Promise<void> {
  const { walletId } = req.params as { walletId: string };
  // TODO: update the upper line

  const wallet = await getWalletById(walletId);

  if (!wallet) {
    res.sendStatus(404);
  }

  res.status(200).json(wallet);
}

async function BuyCrypto(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.session.authenticatedUser;
    const { cryptoType, quantity } = req.body as CryptoRequest;
    const user = await getUserByID(userId);
    const crypto = await getCryptoByType(cryptoType);
    // const wallet = await getWalletByUserId(userId, cryptoType);
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

    // res.json(user);
    // res.json(crypto);
    // res.json(wallet);

    updateBuyUserBalance(user, totalCost);

    if (wallet) {
      // TODO:check if the user has the crytoType in wallet )
      updateBuyWallet(wallet, quantity);
      // console.log(`${wallet}`);
    } else {
      await addWallet(quantity, cryptoType);
    }

    // console.log(`Bought ${wallet.amount} ${crypto.cryptoType} for $${totalCost}`);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.sendStatus(500).json(databaseErrorMessage);
  }
}

async function sellCrypto(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.session.authenticatedUser;
    const { cryptoType, quantity } = req.body as CryptoRequest;
    const user = await getUserByID(userId);
    const crypto = await getCryptoByType(cryptoType);
    const wallet = await getWalletByUserId(user, cryptoType);

    if (!user) {
      res.sendStatus(404).json('User Not Found');
      return;
    }
    if (!req.session.isLoggedIn) {
      res.sendStatus(401).json('User is Not Logged In');
      return;
    }
    if (!wallet) {
      res.sendStatus(403).json('Crypto Not Found');
      return;
    }

    const totalCost = quantity * crypto.value;

    if (wallet.amount < quantity) {
      res.sendStatus(400).json('User does not own enough to sell');
      console.error('User does not have enough money to buy');
      return;
    }

    updateSellUserBalance(user, totalCost);
    updateSellWallet(wallet, quantity);

    // console.log(`Bought ${wallet.amount} ${crypto.cryptoType} for $${totalCost}`);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.sendStatus(500).json(databaseErrorMessage);
  }
}
export { BuyCrypto, sellCrypto, getWallet };
