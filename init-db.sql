-- Initialize databases for e-bank microservices
CREATE DATABASE IF NOT EXISTS ebank_auth;
CREATE DATABASE IF NOT EXISTS ebank_clients;
CREATE DATABASE IF NOT EXISTS ebank_accounts;
CREATE DATABASE IF NOT EXISTS ebank_transactions;

-- Grant privileges
GRANT ALL PRIVILEGES ON ebank_auth.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON ebank_clients.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON ebank_accounts.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON ebank_transactions.* TO 'root'@'%';

FLUSH PRIVILEGES;


