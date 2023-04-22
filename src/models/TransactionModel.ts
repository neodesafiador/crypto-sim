import { AppDataSource } from '../dataSource';
import { Transaction } from '../entities/Transaction';
import { User } from '../entities/User';
// import { CryptoCurrency } from '../entities/CryptoCurrency';
import { getCryptoByType } from './CryptoModel';

const transactionRepository = AppDataSource.getRepository(Transaction);

async function allTransactionData(): Promise<Transaction[]> {
  return await transactionRepository.find();
}

async function addTransact(cryptoType: string, amount: number): Promise<Transaction> {
  // Create the new user object
  const newTransaction = new Transaction();
  newTransaction.amount = amount;
  newTransaction.crypto = await getCryptoByType(cryptoType);

  await transactionRepository.save(newTransaction);

  return newTransaction;
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
  transaction: Transaction,
  quantity: number
): Promise<Transaction> {
  const updatedTransaction = transaction;
  updatedTransaction.amount += quantity;
  updatedTransaction.boughtOn = new Date();
  console.log(`Quantity: ${updatedTransaction.amount}`);

  await transactionRepository.save(updatedTransaction);

  return updatedTransaction;
}

async function updateSellTransaction(
  transaction: Transaction,
  quantity: number
): Promise<Transaction> {
  const updatedTransaction = transaction;
  updatedTransaction.amount -= quantity;
  updatedTransaction.soldOn = new Date();
  console.log(`Quantity: ${updatedTransaction.amount}`);

  await transactionRepository.save(updatedTransaction);

  return updatedTransaction;
}

async function getTransactionByUser(userId: string, cryptoType: string): Promise<Transaction> {
  const transaction = await transactionRepository
    .createQueryBuilder('transaction')
    .leftJoinAndSelect('transaction.user', 'user')
    .where('user.userId = :userId', 'transaction.crypto.cryptoType = :cryptoType', { userId, cryptoType })
    .select(['transaction', 'user.userId'])
    .getOne();

  return transaction;
}

// async function getAmountByTransaction(amount: number): Promise<number> {
//   const amounty = await transactionRepository
//     .createQueryBuilder()
//     .where({ transaction: { amount } })
//     .getOne();
//   return amounty;
// }

export {
  addTransact,
  allTransactionData,
  getTransactionById,
  updateBuyTransaction,
  updateSellTransaction,
  getTransactionByUser,
};
