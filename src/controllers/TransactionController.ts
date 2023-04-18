import { Request, Response } from 'express';
import { parseDatabaseError } from '../utils/db-utils';
import { updateBuyUserBalance, updateSellUserBalance, getUserByID } from '../models/UserModel';
import { getCryptoByType } from '../models/CryptoModel';
import {
  addTransact,
  updateBuyTransaction,
  updateSellTransaction,
  getTransactionByUser,
} from '../models/TransactionModel';

async function addTransaction(req: Request, res: Response): Promise<void> {
  const { cryptoType, amount } = req.body as TransactionRequest;

  try {
    await addTransact(cryptoType, amount);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function BuyCrypto(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.session.authenticatedUser;
    const { cryptoType, quantity } = req.body as CryptoRequest;
    const user = await getUserByID(userId);
    const crypto = await getCryptoByType(cryptoType);
    const transaction = await getTransactionByUser(user, cryptoType);

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

    updateBuyUserBalance(user, totalCost);

    if (transaction) {
      // TODO:check if the user has the cryptoType in transaction
      updateBuyTransaction(transaction, quantity);
    } else {
      await addTransact(cryptoType, quantity);
    }

    console.log(`Bought ${quantity} ${crypto.cryptoType} for $${totalCost}`);
    console.log(`Balance: ${user.balance}`);
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
    const transaction = await getTransactionByUser(user, cryptoType);

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

    if (transaction.amount < quantity) {
      res.sendStatus(400).json('User does not own enough to sell');
      console.error('User does not have enough money to buy');
      return;
    }

    updateSellUserBalance(user, totalCost);
    updateSellTransaction(transaction, quantity);

    // console.log(`Bought ${wallet.amount} ${crypto.cryptoType} for $${totalCost}`);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.sendStatus(500).json(databaseErrorMessage);
  }
}
export { addTransaction, BuyCrypto, sellCrypto };
