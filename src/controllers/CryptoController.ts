import { Request, Response } from 'express';
import { parseDatabaseError } from '../utils/db-utils';
import { getUserById } from '../models/UserModel';
import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';
import { CryptoCurrency } from '../entities/CryptoCurrency';
import { allCryptoData, updateCryptoBalance } from '../models/CryptoModel';

const userRepository = AppDataSource.getRepository(User);
const cryptoRepository = AppDataSource.getRepository(CryptoCurrency);

async function buyCryptoCurrency(req: Request, res: Response): Promise<void> {
  const { userId } = req.session.authenticatedUser;
  const user = await getUserById(userId);
  const crypto = await get;

  const { cryptoType, quantity } = req.body;

  if (!user) {
    res.sendStatus(404).json('User Not Found');
    return;
  }
  if (!req.session.isLoggedIn) {
    res.sendStatus(401).json('User is Not Logged In');
  }
  // Calculate total cost of crypto being bought
  const totalCost = quantity * crypto.value;

  // Check if user has enough money to buy
  if (user.balance < totalCost) {
    console.error('User does not have enough money to buy');
    return;
  }

  // Update user balance and profit
  const userRepository = getRepository(User);
  user.prevBalance = user.balance;
  user.balance -= totalCost;
  user.profit += totalCost - user.prevBalance;

  // Update user crypto balance
  updateCryptoBalance(user);
  // const cryptoRepository = getRepository(CryptoCurrency);
  // crypto.value = (crypto.value + crypto.preValue * crypto.quantity) / (crypto.quantity + quantity);
  // crypto.preValue = crypto.value;
  // crypto.quantity += quantity;
  // crypto.boughtOn = new Date();

  // let updatedLink = link;
  // const now = new Date();
  // updatedLink.numHit += 1;
  // updatedLink.lastAccessedOn = now;

  // updatedLink = await linkRepository.save(updatedLink);

  // return updatedLink;

  // Save changes to database
  await userRepository.save(user);
  await cryptoRepository.save(crypto);

  console.log(`Bought ${quantity} ${crypto.cryptoType} for $${totalCost}`);
}
// TODO: function for sell crypto
// TODO:

export { buyCryptoCurrency };
