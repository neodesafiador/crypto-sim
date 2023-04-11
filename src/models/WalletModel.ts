import { AppDataSource } from '../dataSource';
import { Wallet } from '../entities/Wallet';

const walletRepository = AppDataSource.getRepository(Wallet);

async function allWalletData(): Promise<Wallet[]> {
  const allwallet = await walletRepository.find();

  return allwallet;
}
// async function getWalletByID(userId: string): Promise<Wallet | null> {
//   const wallet = await walletRepository.findOne({ where: { userId }, relations: ['user'] });

//   return wallet;
// }

async function getWalletById(walletId: string): Promise<Wallet | null> {
  return await walletRepository
    .createQueryBuilder('user')
    .where({ where: { walletId } })
    .leftJoin('wallets.user', 'user')
    .select([
      'wallet.walletId',
      'wallet.amount',
      'wallet.boughtOn',
      'wallet.balance',
      'wallet.profit',
      'user.userId',
      'user.email',
    ])
    .getOne();
}

async function updateBuyWallet(wallet: Wallet, quantity: number): Promise<Wallet> {
  const updatedWallet = wallet;
  const now = new Date();
  // updatedwallet.preValue = crypto.value;
  updatedWallet.amount += quantity;
  updatedWallet.boughtOn = now;
  console.log(`Quantity: ${updatedWallet.amount}`);

  await walletRepository.save(updatedWallet);

  return updatedWallet;
}

export { allWalletData, getWalletById, updateBuyWallet };
