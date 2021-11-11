const axios = require("axios");
const { config } = require("dotenv");
var express = require('express');
var app = express();
var sensor = require("node-dht-sensor");
app.use(express.json());
const Echo = require("laravel-echo")
global.Pusher = require("pusher-js")
require('dotenv').config()
const Gpio = require('onoff').Gpio

module.exports = {
    start: function (config) {
        console.log('starting switch')
        registerDevice(config)
        getDevicefunctionsStatus(config)
        startListeningOnDeviceChannel(config)
    },
}

function getDevicefunctionsStatus (config) {
    return axios({
        url: "http://" + process.env.BLACK_MIRROR_SERVER_URL + ":" + process.env.BLACK_MIRROR_SERVER_PORT + "/api/get-device-function-status",
        method: "POST",
        data: config,
    }).then((response) => {
        config.device_functions = response.data
        Synctoggles(config.device_functions)
        return Promise.resolve(response)
    }).catch((error) => {
        // console.log(error)
    })
}

function registerDevice(config) {
    return axios({
        url: "http://" + process.env.BLACK_MIRROR_SERVER_URL + ":" + process.env.BLACK_MIRROR_SERVER_PORT + "/api/register-device/" + config.id,
        method: "GET",
    }).then((response) => {
        return Promise.resolve(response)
    }).catch((error) => {
        console.log(error)
    })
}

function startListeningOnDeviceChannel (config) {

const echo = new Echo({
    broadcaster: "pusher",
    key: "your-pusher-key",
    wsHost: process.env.BLACK_MIRROR_SERVER_URL,
    wsPort: 6001,
    forceTLS: false,
    disableStats: true
  });

  console.log('listening on device channel')
  echo.channel("devicechannel").listen(".ping", message => {
    registerDevice(config)
  })
  .listen(".ask-for-temperature", message => {
      sendTemperature(config)
  })
  .listen(".sync-state", message => {
    getDevicefunctionsStatus(config)
  });

  console.log('listening on devicechannel ' + config.id)
  echo.channel("devicechannel" + config.id).listen(".ping", message => {
    registerDevice(config)
  })
  .listen(".toggle-changed", message => {
      toggleEvent(message)
  })

}

function toggleEvent(message) {
    if (process.env.DEVELOPMENT === "false") {
        var pin = new Gpio(message.toggle.pin, 'out')
    } else {
        console.log('setting pin')
    }

    if (message.action === "on") {
        if (process.env.DEVELOPMENT === "false") {
            if (pin.readSync() === 0) {
                pin.writeSync(1)
            }
        } else {
            console.log('turning pin' + message.toggle.pin + ' on')
        }
    }

    if (message.action === "off") {
        if (process.env.DEVELOPMENT === "false") {
            if (pin.readSync() === 1) {
                pin.writeSync(0)
            }
        } else {
            console.log('turning pin' + message.toggle.pin + ' off')
        }
    }
}

function sendTemperature(config) {
    config.device_functions.forEach(a => {
        if (a.type === 'temp-sensor') {
            readTemperature(a)
        }
    });
}

function readTemperature(deviceFunction) {

    if (process.env.DEVELOPMENT === "true") {
        sensor.initialize({
            test: {
                fake: {
                temperature: Number(process.env.TEST_TEMPERATURE),
                humidity: 60
                }
            }
        });
    }

    deviceFunction.temperature = Math.round(sensor.read(22, deviceFunction.pin)) / 10;

    console.log(deviceFunction)

    //send temperature
    return axios({
        url: "http://" + process.env.BLACK_MIRROR_SERVER_URL + ":" + process.env.BLACK_MIRROR_SERVER_PORT + "/api/send-temperature/" + deviceFunction.id,
        method: "POST",
        data: deviceFunction,
    }).then((response) => {
        // console.log(response.data)
        return Promise.resolve(response)
    }).catch((error) => {
        // console.log(error)
    })
}

function Synctoggles (deviceFunctions) {
    deviceFunctions.forEach(a => {
        // console.log(a)
    });
}