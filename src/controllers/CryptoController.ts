import { Request, Response } from 'express';
import { parseDatabaseError } from '../utils/db-utils';
import { updateUserBalance, getUserByID } from '../models/UserModel';
// import { AppDataSource } from '../dataSource';
// import { User } from '../entities/User';
// import { CryptoCurrency } from '../entities/CryptoCurrency';
import { updateCryptoBalance, getCryptoByType, addCrypto } from '../models/CryptoModel';
// import { addCrypto } from '../models/CryptoModel';
// getCryptoByType, getCurrenciesByUserId
// const userRepository = AppDataSource.getRepository(User);
// const cryptoRepository = AppDataSource.getRepository(CryptoCurrency);

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

    // Calculate total cost of crypto being bought
    const totalCost = quantity * crypto.value;

    // Check if user has enough money to buy
    if (user.balance < totalCost) {
      res.sendStatus(401).json('User does not have enough money to buy');
      console.error('User does not have enough money to buy');
      return;
    }

    // Update user balance and profit
    updateUserBalance(user, totalCost);

    // Update user crypto balance
    updateCryptoBalance(crypto, quantity);

    // Save changes to database
    // await userRepository.save(user);
    // await cryptoRepository.save(crypto);

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
