// import { createHash } from 'crypto';
import { AppDataSource } from '../dataSource';
import { CryptoCurrency } from '../entities/CryptoCurrency';
import { User } from '../entities/User';

const cryptoRepository = AppDataSource.getRepository(CryptoCurrency);

async function allCryptoData(): Promise<CryptoCurrency[]> {
  const allCrypto = await cryptoRepository.find();

  return allCrypto;
}

async function addCrypto(cryptoType: string, value: number, user: User): Promise<CryptoCurrency> {
  // Create the new user object
  const newCrypto = new CryptoCurrency();
  newCrypto.cryptoType = cryptoType;
  newCrypto.value = value;
  newCrypto.preValue = value;
  newCrypto.boughtOn = new Date();

  newCrypto.user = user;
  // newCrypto.quantity += 1;

  console.log(newCrypto);

  await cryptoRepository.save(newCrypto);

  return newCrypto;
}

// function createCryptoId(cryptoType: string, userId: string): string {
//   const linkId =

//   return linkId;
// }

// TODO:
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

// TODO:function for value of crypto owned. ( cryto amount * value) can use for rank leaderboard, buy and sell.

export { allCryptoData, updateCryptoBalance, getCryptoByType, addCrypto, getCurrenciesByUserId };
