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
  return await cryptoRepository.findOne({ where: { cryptoType } });
}

async function getCurrenciesByUserId(userId: string): Promise<CryptoCurrency[]> {
  const crypto = await cryptoRepository
    .createQueryBuilder('cryptocurrency')
    .where({ user: { userId } })
    .leftJoin('cryptocurrency.user', 'user')
    .select(['cryptocurrency.cryptoType', 'cryptocurrency.value', 'user.userId'])
    .getMany();

  return crypto;
}

async function updateBuyCryptoBalance(crypto: CryptoCurrency): Promise<CryptoCurrency> {
  const updatedCrypto = crypto;

  updatedCrypto.preValue = crypto.value;

  await cryptoRepository.save(updatedCrypto);

  return updatedCrypto;
}

async function addCryptoCurrencies(name: string, price: number): Promise<void> {
  try {
    await addCrypto(name, price);
  } catch (err) {
    console.error(err);
  }
}

export {
  allCryptoData,
  updateBuyCryptoBalance,
  getCryptoByType,
  addCrypto,
  getCurrenciesByUserId,
  addCryptoCurrencies,
};
