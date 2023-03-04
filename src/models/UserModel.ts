import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';

const userRepository = AppDataSource.getRepository(User);

async function addUser(email: string, passwordHash: string): Promise<User> {
  // Create the new user object
  let newUser = new User();
  newUser.email = email;
  newUser.passwordHash = passwordHash;

  newUser = await userRepository.save(newUser);

  return newUser;
}

async function getUserByEmail(email: string): Promise<User | null> {
  const user = await userRepository.findOne({ where: { email } });
  return user;
}

// async function getUserById(userId: string): Promise<User[] | null> {
//   // const user = await userRepository.findOne({ where: { userId } });
//   // return user;

//   if (!userId) {
//     return null;
//   }
//   const user = await userRepository
//     .createQueryBuilder('user')
//     .where({ userId })
//     .select(['user.email', 'user.userId'])
//     .getMany();

//   return user;
// }

export { addUser, getUserByEmail };
