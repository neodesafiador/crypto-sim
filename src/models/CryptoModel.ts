import { AppDataSource } from '../dataSource';
import { CryptoCurrency } from '../entities/CryptoCurrency';

const cryptoRepository = AppDataSource.getRepository(CryptoCurrency);

async function allCryptoData(): Promise<CryptoCurrency[]> {
  const allCrypto = await cryptoRepository.find();

  return allCrypto;
}

// async function buyCrypto(): Promise<CryptoCurrency[]> {
//   const crypto =;

//   return crypto;
// }

// async function updateUser
async function updateCryptoBalance(crypto: CryptoCurrency): Promise<CryptoCurrency> {
  const updatedcrypto = crypto;
  const now = new Date();
  crypto.value = (crypto.value + crypto.preValue * crypto.quantity) / (crypto.quantity + quantity);
  crypto.preValue = crypto.value;
  crypto.quantity += quantity;
  crypto.boughtOn = now;

  return updatedcrypto;
}

// TODO:function for value of crypto owned. ( cryto amount * value) can use for rank leaderboard, buy and sell.

export { allCryptoData, updateCryptoBalance };
