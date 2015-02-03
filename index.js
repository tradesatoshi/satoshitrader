var util = require('util'),
    _ = require('underscore'),
    request	= require('request'),
    crypto = require('crypto'),
    VError = require('verror'),
    microtime = require('microtime');

var BTCChina = function BTCChina(key, secret, server, timeout)
{
    this.key = key;
    this.secret = secret;

    this.server = server || 'https://api.btcchina.com';

    this.timeout = timeout || 30000;
};

BTCChina.prototype.privateRequest = function(method, params, callback)
{
    var functionName = 'BTCChina.privateRequest()',
        self = this;

    if(!this.key || !this.secret)
    {
        var error = new VError('%s must provide key and secret to make this API request.', functionName);
        return callback(error);
    }

    if(!_.isArray(params))
    {
        var error = new VError('%s second parameter %s must be an array. If no params then pass an empty array []', functionName, params);
        return callback(error);
    }

    if (!callback || typeof(callback) != 'function')
    {
        var error = new VError('%s third parameter needs to be a callback function', functionName);
        return callback(error);
    }

    var tonce = microtime.now();

    var message = "tonce=" + tonce + "&" +
            "accesskey=" + this.key + "&" +
            "requestmethod=post&" +
            "id=1&" +
            "method=" + method + "&" +
            "params=" + params.join(',');

    var signer = crypto.createHmac('sha1', this.secret);
    var hmac = signer.update(message).digest('hex');
    var signature = new Buffer(this.key + ':' + hmac).toString('base64');

    var headers = {
        "User-Agent": "BTC China Javascript API Client",
        'Authorization': 'Basic ' + signature,
        'Json-Rpc-Tonce': tonce
    };

    var options = {
        url: this.server + '/api_trade_v1.php',
        method: 'POST',
        headers: headers,
        json: {
            method: method,
            params: params,
            id: 1}
    };

    var requestDesc = util.format('%s request to url %s with tonce %s, method %s and params %s',
        options.method, options.url, tonce, method, JSON.stringify(params));

    executeRequest(options, requestDesc, callback);
};

BTCChina.prototype.publicRequest = function(method, params, callback)
{
    var functionName = 'BTCChina.publicRequest()';

    if(!_.isObject(params))
    {
        var error = new VError('%s second parameter %s must be an object. If no params then pass an empty object {}', functionName, params);
        return callback(error);
    }

    if (!callback || typeof(callback) != 'function')
    {
        var error = new VError('%s third parameter needs to be a callback function with err and data parameters', functionName);
        return callback(error);
    }

    var headers = {"User-Agent": "BTC China Javascript API Client"};

    var path = '/data/' + method;

    var options = {
        url: this.server + path,
        method: 'GET',
        headers: headers,
        timeout: this.timeout,
        qs: params,
        json: {}        // request will parse the json response into an object
    };

    var requestDesc = util.format('%s request to url %s with parameters %s',
        options.method, options.url, JSON.stringify(params));

    executeRequest(options, requestDesc, callback)
};

function executeRequest(options, requestDesc, callback)
{
    var functionName = 'BTCChina.executeRequest()';

    request(options, function(err, response, data)
    {
        var error = null;   // default to no errors

        if(err)
        {
            error = new VError(err, '%s failed %s', functionName, requestDesc);
            error.name = err.code;
        }
        else if (response.statusCode < 200 || response.statusCode >= 300)
        {
            error = new VError('%s HTTP status code %s returned from %s', functionName,
                response.statusCode, requestDesc);
            error.name = response.statusCode;
        }
        // if request was not able to parse json response into an object
        else if (!_.isObject(data) )
        {
            error = new VError('%s could not parse response from %s\nResponse: %s', functionName, requestDesc, data);
            error.name = data;
        }
        else if (_.has(data, 'error'))
        {
            error = new VError('%s API returned error code %s from %s\nError message: %s', functionName,
                data.error.code, requestDesc, data.error.message);
            error.name = data.error.message;
        }

        callback(error, data);
    });
}

function constructParamArray(args, maxArgs)
{
    var paramArray = [];

    for (i = 1; i <= maxArgs; i++)
    {
        // if the argument is undefined
        if (_.isUndefined(args[i]))
            break;
        else
            paramArray.push(args[i]);
    }

    return paramArray;
}

//
// Public Functions
//

BTCChina.prototype.getTicker = function getTicker(callback, market)
{
    this.publicRequest('ticker', {market: market}, callback);
};

BTCChina.prototype.getOrderBook = function getOrderBook(callback, market)
{
    this.publicRequest('orderbook', {market: market}, callback);
};

BTCChina.prototype.getHistoryData = function getHistoryData(callback, params)
{
    this.publicRequest('historydata', params, callback);
};

BTCChina.prototype.getTrades = function getTrades(callback)
{
    this.publicRequest('trades', {}, callback);
};

//
// Private Functions
//

BTCChina.prototype.buyOrder2 = function buyOrder2(callback, price, amount, market)
{
    var params = constructParamArray(arguments, 3);

    this.privateRequest('buyOrder2', params, callback);
};

BTCChina.prototype.sellOrder2 = function sellOrder2(callback, price, amount, market)
{
    var params = constructParamArray(arguments, 3);

    this.privateRequest('sellOrder2', params, callback);
};

// calls either buyOrder2 or sellOrder2 functions depending on the second type parameter
BTCChina.prototype.createOrder2 = function createOrder2(callback, type, price, amount, market)
{
    var functionName = 'BTCChina.createOrder2()',
        // rest removes the first element of the array
        params = constructParamArray(_.rest(arguments), 3);

    if (type === 'buy')
    {
        this.privateRequest('buyOrder2', params, callback);
    }
    else if (type === 'sell')
    {
        this.privateRequest('sellOrder2', params, callback);
    }
    else
    {
        var error = new VError('%s second parameter type "%s" needs to be either "buy" or "sell"', functionName, type);
        callback(error);
    }
};

BTCChina.prototype.cancelOrder = function cancelOrder(callback, id, market)
{
    var params = constructParamArray(arguments, 2);

    this.privateRequest('cancelOrder', params, callback);
};

BTCChina.prototype.getOrders = function getOrders(callback, openOnly, market, limit, offset, since, withDetail)
{
    var params = constructParamArray(arguments, 6);

    this.privateRequest('getOrders', params, callback);
};

BTCChina.prototype.getOrder = function getOrder(callback, id, market, withDetail)
{
    var params = constructParamArray(arguments, 3);

    this.privateRequest('getOrder', params, callback);
};

BTCChina.prototype.getTransactions = function getTransactions(callback, type, limit, offset, since, sinceType)
{
    var params = constructParamArray(arguments, 3);

    this.privateRequest('getTransactions', params, callback);
};

BTCChina.prototype.getMarketDepth2 = function getMarketDepth2(callback, limit, market)
{
    var params = constructParamArray(arguments, 2);

    this.privateRequest('getMarketDepth2', params, callback);
};

BTCChina.prototype.getDeposits = function getDeposits(callback, currency, pendingOnly)
{
    var params = constructParamArray(arguments, 2);

    this.privateRequest('getDeposits', params, callback);
};

BTCChina.prototype.getWithdrawal = function getWithdrawal(callback, id, currency)
{
    var params = constructParamArray(arguments, 2);

    this.privateRequest('getWithdrawal', params, callback);
};

BTCChina.prototype.getWithdrawals = function getWithdrawals(callback, currency, pendingOnly)
{
    var params = constructParamArray(arguments, 2);

    this.privateRequest('getWithdrawals', params, callback);
};

BTCChina.prototype.requestWithdrawal = function requestWithdrawal(callback, currency, amount)
{
    var params = constructParamArray(arguments, 2);

    this.privateRequest('requestWithdrawal', params, callback);
};

BTCChina.prototype.getAccountInfo = function getAccountInfo(callback, type)
{
    var params = constructParamArray(arguments, 1);

    this.privateRequest('getAccountInfo', params, callback);
};

module.exports = BTCChina;