import { Request, Response } from 'express';
import argon2 from 'argon2';
// import axios from 'axios';
import { addMinutes, isBefore, parseISO, formatDistanceToNow } from 'date-fns';
import { addUser, getUserByEmail, updateBalance } from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';

async function registerUser(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as AuthRequest;

  const passwordHash = await argon2.hash(password);
  console.log(passwordHash);

  try {
    await addUser(email, passwordHash);
    // res.sendStatus(201);
    res.redirect(`crypto`);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function logIn(req: Request, res: Response): Promise<void> {
  console.log(req.session);

  const now = new Date();
  const logInTimeout = parseISO(req.session.logInTimeout);
  if (logInTimeout && isBefore(now, logInTimeout)) {
    const timeRemaining = formatDistanceToNow(logInTimeout);
    const message = `You have ${timeRemaining} remaining.`;
    res.status(429).send(message); // 429 Too Many Requests
    return;
  }

  const { email, password } = req.body as AuthRequest;

  const user = await getUserByEmail(email);

  if (!user) {
    res.sendStatus(404); // 404 Not Found (403 Forbidden would also make a lot of sense here)
    return;
  }

  const { passwordHash } = user;

  if (!(await argon2.verify(passwordHash, password))) {
    if (!req.session.logInAttempts) {
      req.session.logInAttempts = 1;
    } else {
      req.session.logInAttempts += 1;
    }

    if (req.session.logInAttempts >= 5) {
      const threeMinutesLater = addMinutes(now, 3).toISOString();
      req.session.logInTimeout = threeMinutesLater;
      req.session.logInAttempts = 0;
    }

    res.sendStatus(404); // 404 Not Found - user with email/pass doesn't exist
    return;
  }

  await req.session.clearSession();

  req.session.authenticatedUser = {
    userId: user.userId,
    email: user.email,
  };
  req.session.isLoggedIn = true;
  // res.sendStatus(201);
  res.redirect(`crypto`);
}

async function logOut(req: Request, res: Response): Promise<void> {
  req.session.isLoggedIn = false;

  res.redirect('/login');
}

async function addBalance(req: Request, res: Response): Promise<void> {
  const { email } = req.body as AuthRequest;

  const user = await getUserByEmail(email);

  if (!user) {
    res.sendStatus(404); // 404 Not Found (403 Forbidden would also make a lot of sense here)
    return;
  }

  await updateBalance(user);

  res.sendStatus(201);
}

export { registerUser, logIn, logOut, addBalance };
