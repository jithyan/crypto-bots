export const createTradeTable = `CREATE TABLE IF NOT EXISTS trades (
  trade_id CHAR(128) PRIMARY KEY,
  symbol VARCHAR(20),
  at_timestamp DATETIME,
  action VARCHAR(4),
  price DECIMAL(16,8),
  amount DECIMAL(16,8),
  busd_value DECIMAL(16,8),
  from_coin VARCHAR(10),
  to_coin VARCHAR(10),
  profit DECIMAL(8,3),
  aud_value DECIMAL(16,8),
  aud_busd DECIMAL(16,8),
  commission DECIMAL(16,8),
  is_test BOOLEAN DEFAULT 0,
  INDEX(symbol,at_timestamp,action,is_test)
);`;
