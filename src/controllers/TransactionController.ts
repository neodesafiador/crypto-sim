import { Request, Response } from 'express';
import { parseDatabaseError } from '../utils/db-utils';
// import { updateBuyUserBalance, updateSellUserBalance, getUserByID } from '../models/UserModel';
import { updateBuyUserBalance, updateSellUserBalance, getUserByID } from '../models/UserModel';
import { getCryptoByType } from '../models/CryptoModel';
import {
  addTransact,
  updateBuyTransaction,
  updateSellTransaction,
  userHasTransactionForCryptocurrency,
  userHasCryptoAmount,
} from '../models/TransactionModel';

async function addTransaction(req: Request, res: Response): Promise<void> {
  const { cryptoType, amount } = req.body as TransactionRequest;
  const { userId } = req.session.authenticatedUser;
  const user = await getUserByID(userId);

  try {
    await addTransact(user, cryptoType, amount);
    // res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function buyCrypto(req: Request, res: Response): Promise<void> {
  const { isLoggedIn } = req.session;
  const { userId } = req.session.authenticatedUser;
  if (!isLoggedIn) {
    res.sendStatus(401);
    return;
  }
  const { cryptoType, quantity } = req.body as { cryptoType: string; quantity: number };
  const cryptocurrency = await getCryptoByType(cryptoType);
  const user = await getUserByID(userId);

  if (!user) {
    res.sendStatus(404);
    return;
  }

  const totalCost = quantity * cryptocurrency.value;

  if (user.balance < totalCost) {
    res.sendStatus(400).json('User does not have enough money to buy');
    console.error('User does not have enough money to buy');
    return;
  }

  await updateBuyUserBalance(user, totalCost);

  const transactionExists = await userHasTransactionForCryptocurrency(userId, cryptoType);

  if (transactionExists) {
    const { transactionId } = req.params as { transactionId: string };
    await updateBuyTransaction(transactionId, quantity, user, cryptoType);
    res.render('../views/buyCryptoPage', { cryptoType, quantity });
    return;
  }

  await addTransact(user, cryptoType, quantity);

  res.render('../views/buyCryptoPage', { cryptoType, quantity });
}

async function sellCrypto(req: Request, res: Response): Promise<void> {
  const { isLoggedIn } = req.session;
  const { userId } = req.session.authenticatedUser;
  if (!isLoggedIn) {
    res.sendStatus(401);
    return;
  }
  const { cryptoType, quantity } = req.body as { cryptoType: string; quantity: number };

  const cryptocurrency = await getCryptoByType(cryptoType);
  const user = await getUserByID(userId);

  if (!cryptocurrency || !user) {
    res.sendStatus(404);
    return;
  }

  const totalCost = quantity * cryptocurrency.value;
  // check if user has crypto
  const transactionExists = await userHasTransactionForCryptocurrency(userId, cryptoType);
  if (transactionExists) {
    // check if user has amount of crypto
    const cryptoAmountExists = await userHasCryptoAmount(userId, cryptoType, quantity);
    if (cryptoAmountExists) {
      const { transactionId } = req.params as { transactionId: string };
      updateSellTransaction(transactionId, quantity, user, cryptoType);
      updateSellUserBalance(user, totalCost);
      res.render('../views/sellCryptoPage', { cryptoType, quantity });
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(402);
  }
}

export { addTransaction, buyCrypto, sellCrypto };
