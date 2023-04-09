import { AppDataSource } from '../dataSource';
import { CryptoCurrency } from '../entities/CryptoCurrency';

const cryptoRepository = AppDataSource.getRepository(CryptoCurrency);

async function allCryptoData(): Promise<CryptoCurrency[]> {
  const allCrypto = await cryptoRepository.find();

  return allCrypto;
}
// TODO:
async function getCryptoByType(cryptoType: string): Promise<CryptoCurrency> {
  const crypto = await cryptoRepository.findOne({ where: { cryptoType } });

  return crypto;
}

async function updateCryptoBalance(
  crypto: CryptoCurrency,
  quantity: number
): Promise<CryptoCurrency> {
  const updatedCrypto = crypto;
  const now = new Date();
  // updatedCrypto.value = ;// TODO: get newCryptoValue
  updatedCrypto.preValue = crypto.value;
  updatedCrypto.quantity += quantity;
  updatedCrypto.boughtOn = now;

  return updatedCrypto;
}

async function addCrypto(cryptoType: string, value: number): Promise<CryptoCurrency> {
  // Create the new user object
  let newCrypto = new CryptoCurrency();
  newCrypto.cryptoType = cryptoType;
  newCrypto.value = value;

  newCrypto = await cryptoRepository.save(newCrypto);

  return newCrypto;
}
// TODO:function for value of crypto owned. ( cryto amount * value) can use for rank leaderboard, buy and sell.

export { allCryptoData, updateCryptoBalance, getCryptoByType, addCrypto };
