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
    updateBuyUserBalance(user, totalCost);

    // Update user crypto balance
    updateBuyCryptoBalance(crypto, quantity);

    console.log(`Bought ${quantity} ${crypto.cryptoType} for $${totalCost}`);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.sendStatus(500).json(databaseErrorMessage);
  }
}

// async function BuyCrypto(req: Request, res: Response): Promise<void> {
//   try {
//     const { userId } = req.session.authenticatedUser;
//     const { cryptoType, quantity } = req.body as CryptoRequest;
//     const user = await getUserByID(userId);
//     const crypto = await getCryptoByType(cryptoType);
//     // const { userId } = req.body;
//     // const { cryptoType } = req.body;
//     // const quantity = parseFloat(req.body.quantity);
//     // const value = parseFloat(req.body.value);

//     // const userRepository = getRepository(User);
//     // const user = await userRepository.findOneOrFail(userId);

//     // Check if user has enough balance
//     if (user.balance < quantity * value) {
//       return res.status(400).json({ message: 'Insufficient balance.' });
//     }

//     // Check if user already has a wallet for this cryptocurrency
//     const walletRepository = getRepository(Wallet);
//     let wallet = await walletRepository.findOne({
//       where: { user, currency: { cryptoType } },
//     });

//     if (!wallet) {
//       // Create a new wallet for the cryptocurrency
//       wallet = new Wallet();
//       wallet.walletId = uuidv4();
//       wallet.address = generateAddress();
//       wallet.privateKey = generatePrivateKey();
//       wallet.amount = 0;
//       wallet.balance = 0;
//       wallet.profit = 0;
//       wallet.user = user;

//       const cryptoCurrency = new CryptoCurrency();
//       cryptoCurrency.cryptoType = cryptoType;
//       cryptoCurrency.value = value;
//       cryptoCurrency.preValue = value;
//       cryptoCurrency.boughtOn = new Date();
//       cryptoCurrency.quantity = quantity;
//       cryptoCurrency.user = user;
//       cryptoCurrency.wallet = wallet;

//       await getRepository(CryptoCurrency).save(cryptoCurrency);
//     } else {
//       // Update the existing wallet and cryptocurrency
//       const cryptoCurrencyRepository = getRepository(CryptoCurrency);
//       const cryptoCurrency = await cryptoCurrencyRepository.findOne({ where: { wallet } });

//       cryptoCurrency.value = value;
//       cryptoCurrency.preValue = value;
//       cryptoCurrency.quantity += quantity;

//       await cryptoCurrencyRepository.save(cryptoCurrency);
//     }

//     // Update user balance
//     user.prevBalance = user.balance;
//     user.balance -= quantity * value;
//     user.profit = user.balance - 100;

//     await userRepository.save(user);

//     res.status(200).json({ message: 'Successfully bought cryptocurrency.' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'An error occurred while buying cryptocurrency.' });
//   }
// }

// TODO: function for sell crypto

export { addCryptoCurrency, buyCryptoCurrency };
