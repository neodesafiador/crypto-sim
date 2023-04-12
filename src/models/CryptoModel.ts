// import { createHash } from 'crypto';
import { AppDataSource } from '../dataSource';
import { CryptoCurrency } from '../entities/CryptoCurrency';

const cryptoRepository = AppDataSource.getRepository(CryptoCurrency);

async function allCryptoData(): Promise<CryptoCurrency[]> {
  const allCrypto = await cryptoRepository.find();

  return allCrypto;
}

async function addCrypto(cryptoType: string, value: number): Promise<CryptoCurrency> {
  // Create the new user object
  const newCrypto = new CryptoCurrency();
  newCrypto.cryptoType = cryptoType;
  newCrypto.value = value;
  newCrypto.preValue = value;

  await cryptoRepository.save(newCrypto);

  return newCrypto;
}

async function getCryptoByType(cryptoType: string): Promise<CryptoCurrency> {
  const crypto = await cryptoRepository.findOne({ where: { cryptoType } });

  return crypto;
}

async function getCurrenciesByUserId(userId: string): Promise<CryptoCurrency[]> {
  const crypto = await cryptoRepository
    .createQueryBuilder('link')
    // .where('userId = :userId', { user: { userId } })
    .where({ user: { userId } })
    .leftJoin('currency.user', 'user')
    .select(['currency.cryptoType', 'currency.value', 'user.userId'])
    .getMany();

  return crypto;
}

async function updateBuyCryptoBalance(crypto: CryptoCurrency): Promise<CryptoCurrency> {
  const updatedCrypto = crypto;

  updatedCrypto.preValue = crypto.value;

  await cryptoRepository.save(updatedCrypto);

  return updatedCrypto;
}

// TODO:function for value of crypto owned. ( cryto amount * value) can use for rank leaderboard, buy and sell.

export { allCryptoData, updateBuyCryptoBalance, getCryptoByType, addCrypto, getCurrenciesByUserId };
