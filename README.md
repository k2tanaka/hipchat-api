hipchat-api
=========

## Summary

HipChat API Client

### Installation

	$ npm install hipchat-api

### Usage

	var HipchatApi = require('hipchat-api');

##### Constructor

    // configure
    var options = {
        "timeout": 5000, // http timeout (ms)
        "maxSockets": 100, // http agents
        "key": "xxxxx", // API-key
        "proxy": "http://proxyhogehoge/", // http-proxy, false: if not use
    };
    // setup
	var hipChat = new HipchatApi(auth_token);

### API

#### list Rooms

    hipChat.listRooms()

#### Create Room

    hipChat.createRoom()

#### Show Room

    hipChat.showRoom()

#### Delete Room

    hipChat.deleteRoom()

#### Post Message

    hipChat.postMessage()

#### Show Message History

    hipChat.getHistory()

##### example) Get Room List

    hipChat.listRooms(function(err, rooms) {
        console.log(rooms);
    });
