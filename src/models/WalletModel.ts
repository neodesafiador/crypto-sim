import { AppDataSource } from '../dataSource';
import { Wallet } from '../entities/Wallet';
import { User } from '../entities/User';

const walletRepository = AppDataSource.getRepository(Wallet);

async function allWalletData(): Promise<Wallet[]> {
  const allwallet = await walletRepository.find();

  return allwallet;
}

async function addWallet(amount: number, cryptoType: string): Promise<Wallet> {
  // Create the new user object
  const newWallet = new Wallet();
  newWallet.amount = amount;
  newWallet.name = cryptoType;
  newWallet.boughtOn = new Date();

  await walletRepository.save(newWallet);

  return newWallet;
}

async function getWalletById(walletId: string): Promise<Wallet | null> {
  return await walletRepository
    .createQueryBuilder('user')
    .where({ where: { walletId } })
    .leftJoin('wallets.user', 'user')
    .select(['wallet.walletId', 'wallet.amount', 'wallet.boughtOn', 'user.userId', 'user.email'])
    .getOne();
}

async function updateBuyWallet(wallet: Wallet, quantity: number): Promise<Wallet> {
  const updatedWallet = wallet;
  updatedWallet.amount += quantity;
  updatedWallet.boughtOn = new Date();
  console.log(`Quantity: ${updatedWallet.amount}`);

  await walletRepository.save(updatedWallet);

  return updatedWallet;
}

async function updateSellWallet(wallet: Wallet, quantity: number): Promise<Wallet> {
  const updatedWallet = wallet;
  updatedWallet.amount -= quantity;
  console.log(`Quantity: ${updatedWallet.amount}`);

  await walletRepository.save(updatedWallet);

  return updatedWallet;
}

async function getWalletByUserId(user: User, cryptoType: string): Promise<Wallet> {
  const wallet = user.wallets.find((wallets) => wallets.name === cryptoType);

  return wallet;
}

export {
  addWallet,
  allWalletData,
  getWalletById,
  updateBuyWallet,
  updateSellWallet,
  getWalletByUserId,
};
