// var test = require('./test');
var lightsensor = require('./lightSensor/main.js')
var blackmirror = require('./black-mirror/main.js')
require('dotenv').config()


if (process.env.BLACK_MIRROR_SWITCH === "true") {
    blackmirror.start()
}

if (process.env.LIGHT_TOGGLE_SENSOR === "true") {
    // lightsensor.start()
}

if (process.env.TEMP_SENSOR === "true") {
    console.log('test')
}