var TradeSatoshi = require('tradesatoshi');

var since1Minute = new Date().getTime() / 1000 -  60, // convert to seconds then take off 60 seconds
    since1Day = new Date().getTime() / 1000 -  60 * 60 * 24 // convert to seconds then take off 1 day

// Test public data APIs
var publicClient = new TradeSatoshi();

// publicClient.getTicker(console.log, 'BTCCNY');

// publicClient.getOrderBook(console.log, 'BTCCNY');

// publicClient.getTrades(console.log);

// publicClient.getHistoryData(console.log, {});

// get 100 trades since trade id 20500000
//publicClient.getHistoryData(console.log, {limit: 100, since: 20500000 });

// get 2 trades since 1 minute ago
//publicClient.getHistoryData(console.log, {limit: 2, since: since1Minute, sincetype: 'time' });

// Either pass your API key and secret as the first and second parameters to examples.js. eg
// node examples.js your-api-key your-api-secret
//
// Or enter them below.
// WARNING never commit your API keys into a public repository.
var key = process.argv[2] || 'your-api-key';
var secret = process.argv[3] || 'your-api-secret';

var privateClient = new TradeSatoshi(key, secret);

// uncomment the API you want to test.
// Be sure to check the parameters so you don't do any unwanted live trades

// privateClient.getAccountInfo(console.log);
// privateClient.getAccountInfo(console.log, 'all');
// privateClient.getAccountInfo(console.log, 'profile');
// privateClient.getAccountInfo(console.log, 'loan');
// privateClient.getAccountInfo(console.log, 'balance');

// privateClient.buyOrder2(console.log, 1000, 0.001, 'BTCCNY');
// privateClient.sellOrder2(console.log, 9000, 0.0001);
// privateClient.createOrder2(console.log, 'buy', 999, 0.0001, 'BTCCNY');
// privateClient.createOrder2(console.log, 'sell', 8888, 0.0002, 'BTCCNY');
// market order
// privateClient.createOrder2(console.log, 'buy', null, 0.0001, 'BTCCNY');

// privateClient.cancelOrder(console.log, 1);

// privateClient.getOrders(console.log);
// privateClient.getOrders(console.log, false);
// privateClient.getOrders(console.log, false, 'BTCCNY', 2, 0, since1Day, true);
// privateClient.getOrders(console.log, false, 'BTCCNY', 2, 0, since1Day, true);

// privateClient.getOrder(console.log, "75479188");
// privateClient.getOrder(console.log, 1);
// privateClient.getOrder(console.log, 1, 'BTCCNY', true);

// privateClient.getTransactions(console.log);
// privateClient.getTransactions(console.log, 'all', 10);
// privateClient.getTransactions(console.log, 'fundmoney', 2);
// privateClient.getTransactions(console.log, 'all', 5, 0, since1Day, 'time');

// privateClient.getMarketDepth2(console.log);
// privateClient.getMarketDepth2(console.log, 3);
// privateClient.getMarketDepth2(console.log, 5, 'LTCCNY');

// privateClient.getDeposits(console.log, 'BTC');
// privateClient.getDeposits(console.log, 'BTC', false);

// privateClient.getWithdrawals(console.log, 'BTC');
// privateClient.getWithdrawals(console.log, 'BTC', false);

// privateClient.getWithdrawal(console.log, 1);

// privateClient.requestWithdrawal(console.log, 'BTC', 0.01);
