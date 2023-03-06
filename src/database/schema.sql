CREATE TABLE IF NOT EXISTS Users (
  --userID       INT PRIMARY KEY NOT NULL,
  email        TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  balance      DECIMAL(10, 2),
  profitOrLoss       DECIMAL(10, 2),
);

-- CREATE TABLE IF NOT EXISTS CryptoCurrencies (
--   cryptoID   INT PRIMARY KEY NOT NULL,
--   cryptoType TEXT UNIQUE NOT NULL,
--   price      DECIMAL(10, 2),
--   prePrice   DECIMAL(10, 2),
-- );

-- CREATE TABLE IF NOT EXISTS Transactions (
--   transactionID INT PRIMARY KEY NOT NULL,
--   userID INT,
--   cryptoID INT,
--   type ENUM('buy', 'sell'),
--   amount DECIMAL(10, 2),
--   price DECIMAL(10, 2),
--   date DATETIME,
--   FOREIGN KEY (userID) REFERENCES Users(userID, profitOrLoss),
--   FOREIGN KEY (cryptoID) REFERENCES CryptoCurrencies(cryptoID)
-- );

-- CREATE VIEW Leaderboard AS
--   SELECT userID, profitOrLoss, date
--   WHERE cryptoID
--   FROM Transactions
--   ORDER BY profitOrLoss DESC;

-- -- Insert initial data into Users Table
-- INSERT INTO Users (userID, username, email, passwordHash, balance, profitOrLoss)
-- VALUES
--   (1, 'user1', 'user1@example.com', 'abcdefg', 10000.00, 0.00),
--   (2, 'user2', 'user2@example.com', 'hijklmn', 10000.00, 0.00),
--   (3, 'user3', 'user3@example.com', 'opqrstu', 10000.00, 0.00);

-- -- Insert initial data into Cryptocurrencies Table
-- INSERT INTO CryptoCurrencies (cryptoID, cryptoType, price, prePrice)
-- VALUES
--   (1, 'Bitcoin', 50000.00, 45000.00),
--   (2, 'Ethereum', 1500.00, 1800.00),
--   (3, 'Dogecoin', 0.05, 0.03);

-- -- Insert some initial transactions into Transactions Table
-- INSERT INTO transactions (transactionID, userID, cryptoID, type, amount, price, date)
-- VALUES
--   (1, 1, 1, 'buy', 1.00, 45000.00, '2023-01-01 12:00:00'),
--   (2, 1, 2, 'buy', 10.00, 1500.00, '2023-01-01 12:05:00'),
--   (3, 2, 3, 'buy', 1000.00, 0.05, '2023-01-01 12:10:00'),
--   (4, 1, 1, 'sell', 0.50, 55000.00, '2023-01-01 12:15:00'),
--   (5, 2, 2, 'sell', 5.00, 1600.00, '2023-01-01 12:20:00'),
--   (6, 3, 3, 'sell', 500.00, 0.04, '2023-01-01 12:25:00');
