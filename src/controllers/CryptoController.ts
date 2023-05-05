import { Request, Response } from 'express';
import { parseDatabaseError } from '../utils/db-utils';
import { addCrypto, addCryptoCurrencies } from '../models/CryptoModel';
import { getUserByID } from '../models/UserModel';

async function addCryptoCurrency(req: Request, res: Response): Promise<void> {
  const { cryptoType, value } = req.body as CryptoAuth;

  try {
    await addCrypto(cryptoType, value);
    res.render(`addCryptoPage`);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
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

    const { userId } = req.session.authenticatedUser;
    const user = await getUserByID(userId);

    let name: string;
    let price: number;

    for (let i = 0; i < 5; i += 1) {
      name = coins[i].slug;
      price = coins[i].quote.USD.price;
      addCryptoCurrencies(name, price);
    }

    res.render('coinsPage', { coins, user });
  }
}

async function renderChartPage(req: Request, res: Response): Promise<void> {
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

    const dataCoin: number[][] = [];

    for (let i = 0; i < 5; i += 1) {
      dataCoin[i] = new Array(6);
      for (let j = 0; j < 6; j += 1) {
        if (j === 0) {
          dataCoin[i][j] = coins[i].quote.USD.percent_change_1h;
        } else if (j === 1) {
          dataCoin[i][j] = coins[i].quote.USD.percent_change_24h;
        } else if (j === 2) {
          dataCoin[i][j] = coins[i].quote.USD.percent_change_7d;
        } else if (j === 3) {
          dataCoin[i][j] = coins[i].quote.USD.percent_change_30d;
        } else if (j === 4) {
          dataCoin[i][j] = coins[i].quote.USD.percent_change_60d;
        } else {
          dataCoin[i][j] = coins[i].quote.USD.percent_change_90d;
        }
      }
    }

    res.render('chartPage', { dataCoin });
  }
}

export { addCryptoCurrency, renderCoinsPage, renderChartPage };
