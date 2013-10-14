var querystring = require('querystring');
var request = require('request');

/**
 * http request
 * @param {Object} options
 * @constructor
 */
function Request(options) {
    this.options = {};
    this.options.key = options.key;
    this.options.timeout = options.timeout || 5000;
    this.options.maxSockets = options.maxSockets || 100;
    this.options.proxy = options.proxy;
}

module.exports = Request;

function convert(f, data) {
    if (!data) {
        return data;
    }

    var d;
    try {
        d = f(data);
    } catch(err) {
        d = data;
    }
    return d;
}

/**
 * Parse the HTTP response data
 * @param {boolean} parse Parse the HTTP response data
 * @param {Object} body http response data
 */
function parseBody(parse, body) {
    if (!parse || !body) {
        return body;
    }

    return convert(JSON.parse, body);
}

/**
 * Stringify the Object
 * @param {Object} data
 */
function stringify(data) {
    return convert(JSON.stringify, data);
}

/**
 * http request
 * @param {Object} options
 * @param {Boolean} parse
 * @param {Function} callback
 */
Request.prototype.execute = function(options, parse, callback) {
    if (arguments.length === 2) {
        callback = parse;
    }

    var self = this;
    request(options, function(err, res, body) {
        if (err) {
            return callback(err);
        }

        if (res.statusCode !== 200) {
            return callback(res.statusCode, body);
        }

        callback(null, parseBody(parse !== false, body));
    });
};

/**
 * get the request options
 * @param {String} url
 * @param {String} path
 * @param {String} method HTTP method
 * @param {Object} headers
 * @return {Object} options
 */
Request.prototype.getOptions = function(url, path, method, headers) {
    var opts = {
        uri: url + path,
        method: method,
        headers: headers,
        encoding: 'utf8',
        timeout: this.options.timeout,
        pool: {
            maxSockets: this.options.maxSockets
        },
        strictSSL: false
    };

    if (this.options.proxy) {
        opts.proxy = this.options.proxy;
    }

    return opts;
};

/**
 * GET
 * @param {String} url
 * @param {String} path
 * @param {Object} params
 * @param {Function} callback
 */
Request.prototype.get = function(url, path, params, callback) {
    params.auth_token = this.options.key;
    var param = querystring.stringify(params);
    var pathWithParam = path + '?' + param;

    this.execute(this.getOptions(url, pathWithParam, 'GET'), callback);
};

/**
 * POST
 * @param {String} url
 * @param {String} path
 * @param {Object} params
 * @param {Object} data
 * @param {Function} callback
 */
Request.prototype.post = function(url, path, params, data, callback) {
    params.auth_token = this.options.key;
    var param = querystring.stringify(params);
    var pathWithParam = path + '?' + param;

    var options = this.getOptions(url, pathWithParam, 'POST');
    options.form = data || {};

    this.execute(options, callback);
};

