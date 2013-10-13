var Request = require('./request');

/**
 * HipChat API Client
 * @see https://www.hipchat.com/docs/api
 * @param {Object} options
 *
 * <pre>
 *  options = {
 *      timeout: 5000, // ms
 *      maxSockets: 100 // pooling
 *      key: 'xxxxxxxxx', // api key
 *      proxy: 'http://internal-vpcp-hogehoge' // http proxy(or :false ,if you dont use)
 *  }
 * </pre>
 * @constructor
 */
function HipChat(options) {
    this.options = options = options || {};
    this.request = new Request(options);
}

module.exports = HipChat;

HipChat.prototype.url = 'http://api.hipchat.com';


/**
 * Post Message
 * @param {String} roomId
 * @param {String} from  Name the message will appear be sent from.
 * @param {String} message
 * @param {Function} callback
 */
HipChat.prototype.postMessage = function(roomId, from, message, callback) {
    if (!from) {
        from = 'HipChat Client';
    }
    var data = {
        room_id: roomId,
        from: from,
        message: message
    };

    this.request.post(this.url, '/v1/rooms/message', {}, data, function(err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, result);
    });
};

/**
 * Get Message History
 * @param {String} roomId
 * @param {String} data fetch history for in YYYY-MM-DD format
 * @param {String} timezone default UTC @see https://www.hipchat.com/docs/api/timezones
 * @param {Function} callback
 */
HipChat.prototype.getHistory = function(roomId, date, timezone, callback) {
    if (!date) {
        date = 'recent'; // or 'yyyy-mm-dd'
    }
    var params = {
        room_id: roomId,
        date: date,
    };

    if (timezone) { // default UTC
        params.timezone = timezone;
    }

    this.request.get(this.url, '/v1/rooms/history', params, function(err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, result);
    });
};

/**
 * List Rooms
 * @param {Function} callback
 */
HipChat.prototype.listRooms = function(callback) {
    this.request.get(this.url, '/v1/rooms/list', {}, function(err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, result);
    });
};

/**
 * Get Room Detail
 * @param {String} roomId
 * @param {Function} callback
 */
HipChat.prototype.showRoom = function(roomId, callback) {
    var params = {
        room_id: roomId
    };

    this.request.get(this.url, '/v1/rooms/show', params, function(err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, result);
    });
};

/**
 * Create New Room
 * @param {String} nname
 * @param {Number} ownerUserId
 * @param {String} privacy  "public" or "private"
 * @param {Function} callback
 */
HipChat.prototype.createRoom = function(name, ownerUserId, privacy, callback) {
    if (!privacy) {
        privacy = 'public';
    }

    var data = {
        name: name,
        owner_user_id: ownerUserId,
        privacy: privacy
    };

    this.request.post(this.url, '/v1/rooms/create', {}, data, function(err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, result);
    });
};

/**
 * Delete a Room
 * @param {String} roomId
 * @param {Function} callback
 */
HipChat.prototype.deleteRoom = function(roomId, callback) {
    var data = {
        room_id: roomId
    };

    this.request.post(this.url, '/v1/rooms/delete', {}, data, function(err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, result);
    });
};

