import { AppDataSource } from '../dataSource';
import { Wallet } from '../entities/Wallet';
// import { User } from '../entities/User';

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
    // .createQueryBuilder('user')
    // .where({ where: { walletId } })
    // .leftJoin('wallets.user', 'user')
    // .select(['wallet.walletId', 'wallet.amount', 'wallet.boughtOn', 'user.userId', 'user.email'])
    // .getOne();
    .createQueryBuilder('wallet')
    .where({ where: { walletId } })
    .leftJoin('wallets.user', 'user')
    .select([
      'wallet.walletId',
      'wallet.amount',
      'wallet.boughtOn',
      'wallet.name',
      'user.userId',
      'user.email',
    ])
    .getOne();
}

async function updateBuyWallet(wallet: Wallet, quantity: number): Promise<Wallet> {
  const updatedWallet = wallet;
  updatedWallet.amount += quantity;
  updatedWallet.boughtOn = new Date();
  // console.log(`Amount: ${updatedWallet.amount}`);

  await walletRepository.save(updatedWallet);

  return updatedWallet;
}

async function updateSellWallet(wallet: Wallet, quantity: number): Promise<Wallet> {
  const updatedWallet = wallet;
  updatedWallet.amount -= quantity;
  // console.log(`Sold: ${quantity}. Left: ${updatedWallet.amount}`);

  await walletRepository.save(updatedWallet);

  return updatedWallet;
}
// async function getReviewsByUserId(
//   userId: string,
//   minRating: number,
//   maxRating: number
// ): Promise<Review[]>
// async function getWalletByUserId(user: User, cryptoType: string): Promise<Wallet> {
// const wallet = user.wallets.find((wallets) => wallets.name === cryptoType);}
async function getWalletByUserId(userId: string, cryptoType: string): Promise<Wallet[]> {
  const wallets = await walletRepository
    .createQueryBuilder('wallet')
    .leftJoinAndSelect('wallet.user', 'user')
    .where('user.userId = :userId', { userId })
    .andWhere('wallet.crypto === cryptoType', {
      cryptoType,
    })
    .select(['wallet', 'user.userId', 'cryptoType', 'wallet.amount'])
    .getMany();

  return wallets;
}

async function walletBelongsToUser(walletId: string, userId: string): Promise<boolean> {
  const reviewExists = await walletRepository
    .createQueryBuilder('wallet')
    .leftJoinAndSelect('wallet.user', 'user')
    .where('wallet.walletId = :walletId', { walletId })
    .andWhere('user.userId = :userId', { userId })
    .getExists();

  return reviewExists;
}

export {
  addWallet,
  allWalletData,
  getWalletById,
  updateBuyWallet,
  updateSellWallet,
  getWalletByUserId,
  walletBelongsToUser,
};
