import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';

const userRepository = AppDataSource.getRepository(User);

async function allUserData(): Promise<User[]> {
  const allUsers = await userRepository.find();

  return allUsers;
} // getting back all of the data. makesure to take out the data for the project.

async function addUser(email: string, passwordHash: string): Promise<User> {
  // Create the new user object
  const newUser = new User();
  newUser.email = email;
  newUser.passwordHash = passwordHash;
  // newUser.balance = 100;
  // newUser.prevBalance = 100;
  // newUser.profit;

  // Then save it to the database
  // NOTES: We reassign to `newUser` so we can access
  // NOTES: the fields the database autogenerates (the id & default columns)
  await userRepository.save(newUser);

  return newUser;
}

async function getAllUsers(): Promise<User[]> {
  return userRepository.find();
}

async function getAllUnverifiedUsers(): Promise<User[]> {
  return userRepository.find({
    select: { email: true, userId: true },
    where: { verifiedEmail: false },
  });
}

async function getUserByEmail(email: string): Promise<User | null> {
  const user = await userRepository.findOne({ where: { email } });

  return user;
}

async function getUserByID(userId: string): Promise<User | null> {
  const user = await userRepository.findOne({ where: { userId }, relations: ['transactions'] });

  return user;
}

async function updateEmailAddress(userId: string, newEmail: string): Promise<void> {
  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ email: newEmail })
    .where({ userId })
    .execute();
}

async function updateBuyUserBalance(user: User, totalCost: number): Promise<User> {
  const updatedUser = user;
  updatedUser.balance -= totalCost;

  await userRepository.save(updatedUser);

  return updatedUser;
}

async function updateSellUserBalance(user: User, totalCost: number): Promise<User> {
  const updatedUser = user;
  updatedUser.balance += totalCost;

  await userRepository.save(updatedUser);

  return updatedUser;
}

export {
  allUserData,
  addUser,
  getUserByEmail,
  getAllUsers,
  getAllUnverifiedUsers,
  updateEmailAddress,
  updateBuyUserBalance,
  getUserByID,
  updateSellUserBalance,
};
