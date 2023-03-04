import sqlite3 from 'sqlite3';

// create a new database connection using the Database class
// provided by the sqlite3 module
const con = new sqlite3.Database(`schema.db`);
const createUserTableQuery = `
CREATE TABLE IF NOT EXISTS Users (
  userID       INTEGER PRIMARY KEY,
  email        TEXT UNIQUE NOT NULL,
  username     TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  balance      DECIMAL(10, 2)
);
`;

// execute it using the run() method
con.run(createUserTableQuery);

// define the SQL query to insert user data into the Users table
const insertUserQuery = `
INSERT INTO Users (userID, username, email, passwordHash, balance)
VALUES
  (1, 'user1', 'user1@example.com', 'abcdefg', 10000.00),
  (2, 'user2', 'user2@example.com', 'hijklmn', 10000.00),
  (3, 'user3', 'user3@example.com', 'opqrstu', 10000.00);
`;

con.exec(insertUserQuery);

// close the database connection using the close() method
con.close();
