// var test = require('./test');
var lightsensor = require('./lightSensor/main.js')
var blackmirror = require('./black-mirror/main.js')
var baseServer= require('./baseServer/main.js')
require('dotenv').config()


baseServer.start()
blackmirror.start()


// if (process.env.BLACK_MIRROR_SWITCH === "true") {
//     blackmirror.start()
// }

// if (process.env.LIGHT_TOGGLE_SENSOR === "true") {
//     lightsensor.start()
// }

// if (process.env.TEMP_SENSOR === "true") {
//     console.log('test')
// }
