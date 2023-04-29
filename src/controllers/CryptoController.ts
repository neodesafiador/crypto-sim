import { Request, Response } from 'express';
import { parseDatabaseError } from '../utils/db-utils';
import { addCrypto } from '../models/CryptoModel';

async function addCryptoCurrency(req: Request, res: Response): Promise<void> {
  const { cryptoType, value } = req.body as CryptoAuth;

  try {
    await addCrypto(cryptoType, value);
    res.render(`addCryptoPage`);
    // res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function addCryptoCurrencies(name: string, price: number): Promise<void> {
  try {
    await addCrypto(name, price);
    // res.sendStatus(201);
  } catch (err) {
    console.error(err);
  }
}

async function renderCoinsPage(req: Request, res: Response): Promise<void> {
  let response = null;
  const { COIN_MARKET_API_KEY } = process.env;

  try {
    response = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
      headers: {
        'X-CMC_PRO_API_KEY': COIN_MARKET_API_KEY,
      },
    });
  } catch (ex) {
    response = null;
    // error
    console.log(ex);
    res.json(ex);
    return;
  }

  if (response.ok) {
    // success
    const coinData = await response.json();
    const coins = coinData.data;
    console.log(coins);
    res.render('coinsPage', { coins });
    let name: string;
    let price: number;

    for (let i = 0; i < 5; i += 1) {
      name = coins[i].slug;
      price = coins[i].quote.USD.price;
      addCryptoCurrencies(name, price);
    }
  }
}

export { addCryptoCurrency, renderCoinsPage };
