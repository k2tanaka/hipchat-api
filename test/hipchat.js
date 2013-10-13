var should = require('should');

var HipChat = require('../lib/hipchat');

describe('hipchat.js', function() {

    var ownerUserId = 'Your user id'; // setting
    var roomName = 'test-room';
    var roomId;

    var options = {
        timeout: 5000,
        maxSockets: 100,
        key: 'Your api key', // setting
        proxy: false
    };


    var hipchat = new HipChat(options);

    describe('#room', function() {

        it('create room', function(done) {
            hipchat.createRoom(roomName, ownerUserId, 'private', function(err, result) {
                should.not.exist(err);
                should.exist(result);

                roomId = result.room.room_id;
                done();
            });
        });

        it('list rooms', function(done) {
            hipchat.listRooms(function(err, result) {
                should.not.exist(err);
                should.exist(result.rooms);

                done();
            });
        });

        it('show room', function(done) {
            hipchat.showRoom(roomId, function(err, result) {
                should.not.exist(err);
                should.exist(result);
                result.room.room_id.should.equal(roomId);

                done();
            });
        });

        it('post message', function(done) {
            var from = 'test-modules';
            var message = 'testメッセージ';
            hipchat.postMessage(roomId, from, message, function(err, result) {
                should.not.exist(err);
                should.exist(result);
                result.status.should.equal('sent');

                done();
            });
        });

        it('get message', function(done) {
            var date;
            var timezone = 'Asia/Tokyo';
            hipchat.getHistory(roomId, date, timezone, function(err, result) {


         console.log(result);
                should.not.exist(err);
                should.exist(result);

                done();
            });
        });

        it('delete room', function(done) {
            hipchat.deleteRoom(roomId, function(err, result) {
                should.not.exist(err);
                should.exist(result);

                done();
            });
        });
    });

});
