import { AppDataSource } from '../dataSource';
import { Transaction } from '../entities/Transaction';
import { User } from '../entities/User';
import { CryptoCurrency } from '../entities/CryptoCurrency';
import { getCryptoByType } from './CryptoModel';

const transactionRepository = AppDataSource.getRepository(Transaction);

async function allTransactionData(): Promise<Transaction[]> {
  return await transactionRepository.find();
}

async function addTransact(byuser: User, cryptoType: string, amount: number): Promise<Transaction> {
  // Create the new user object
  const newTransaction = new Transaction();
  newTransaction.amount = amount;
  newTransaction.boughtOn = new Date();
  newTransaction.user = byuser;
  newTransaction.cryptocurrency = await getCryptoByType(cryptoType);

  await transactionRepository.save(newTransaction);
  console.log(newTransaction);

  return newTransaction;
}

async function userHasTransactionForCryptocurrency(
  userId: string,
  cryptoType: string
): Promise<boolean> {
  const transactionExists = await transactionRepository
    .createQueryBuilder('transaction')
    .leftJoinAndSelect('transaction.user', 'user')
    .leftJoinAndSelect('transaction.cryptocurrency', 'cryptocurrency')
    .where('user.userId = :userId', { userId })
    .andWhere('cryptocurrency.cryptoType = :cryptoType', { cryptoType })
    .getExists();

  return transactionExists;
}

async function userHasCryptoAmount(
  userId: string,
  cryptoType: string,
  quantity: number
): Promise<boolean> {
  const cryptoAmountExists = await transactionRepository
    .createQueryBuilder('transaction')
    .leftJoinAndSelect('transaction.user', 'user')
    .leftJoinAndSelect('transaction.cryptocurrency', 'cryptocurrency')
    .where('user.userId = :userId', { userId })
    .andWhere('cryptocurrency.cryptoType = :cryptoType', { cryptoType })
    .andWhere('transaction.amount >= :quantity', { quantity })
    .getExists();

  return cryptoAmountExists;
}

async function getTransactionById(transactionId: string): Promise<Transaction | null> {
  return await transactionRepository
    .createQueryBuilder('user')
    .where({ where: { transactionId } })
    .leftJoin('transactions.user', 'user')
    .select([
      'transaction.transactionId',
      'transaction.amount',
      'transaction.boughtOn',
      'user.userId',
      'user.email',
    ])
    .getOne();
}

async function updateBuyTransaction(
  transactionId: string,
  quantity: number,
  byuser: User,
  cryptoType: string
): Promise<void> {
  const transaction = await transactionRepository.findOne({ where: { transactionId } });
  transaction.amount += quantity;
  transaction.boughtOn = new Date();
  transaction.user = byuser;
  transaction.cryptocurrency = await getCryptoByType(cryptoType);

  console.log(transaction);

  await transactionRepository.save(transaction);
}

async function updateSellTransaction(
  transactionId: string,
  quantity: number,
  byuser: User,
  cryptoType: string
): Promise<void> {
  const transaction = await transactionRepository.findOne({ where: { transactionId } });
  transaction.amount -= quantity;
  transaction.soldOn = new Date();
  transaction.user = byuser;
  transaction.cryptocurrency = await getCryptoByType(cryptoType);

  console.log(`Amount of ${transaction.cryptocurrency} left: ${transaction.amount}`);

  await transactionRepository.save(transaction);
}

async function getTransactionIdByUser(user: User, cryptocurrency: CryptoCurrency): Promise<string> {
  const transaction = await transactionRepository.findOne({ where: { cryptocurrency, user } });

  return transaction.transactionId;
}

export {
  addTransact,
  allTransactionData,
  getTransactionById,
  updateBuyTransaction,
  updateSellTransaction,
  getTransactionIdByUser,
  userHasTransactionForCryptocurrency,
  userHasCryptoAmount,
};
