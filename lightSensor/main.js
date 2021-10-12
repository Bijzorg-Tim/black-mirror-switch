require('dotenv').config()
// import getSunrise from 'sunrise-sunset-js';
var sunpackage = require("sunrise-sunset-js")

const Gpio = require('onoff').Gpio;

function getLocalSunset () {
    const sunset = sunpackage.getSunset(process.env.COORDINATES_X, process.env.COORDINATES_Y);
    return parseInt(sunset.getTime())
}


function getLocalSunrise() {
    const sunrise = sunpackage.getSunrise(process.env.COORDINATES_X, process.env.COORDINATES_Y);
    return parseInt(sunrise.getTime())
}

function checkTurnLightOn (sunset) {
    const timeNow = parseInt((new Date().getTime())) 
    const time9mins = parseInt((new Date().getTime())) + 540000
    console.log(timeNow)
    console.log(time9mins)
    console.log(sunset)
    if (sunset > timeNow && sunset < time9mins) {
        toggleLights('on')
    }
}

function checkTurnLightOff (sunrise) {
    const timeNow = parseInt((new Date().getTime()))
    const time9mins = parseInt((new Date().getTime())) + 540000
    if (sunrise > timeNow && sunrise < time9mins) {
        toggleLights('off')
    }
}

function toggleLights(toggle) {
    const pins = process.env.LIGHT_PINS_ARRAY.split(',')


    if (toggle === "off") {
        pins.forEach(pin => {
            var led = new Gpio(parseInt(pin), 'out');
            led.writeSync(0)
        });
    }

    if (toggle === "on") {
        pins.forEach(pin => {
            var led = new Gpio(parseInt(pin), 'out');
            led.writeSync(1)
        });
    }
}

module.exports = {
    start: function () {
        //make sure it's off
        toggleLights("off")

        //set initial value's
        var sunsetTime = getLocalSunset()
        var sunriseTime = getLocalSunrise()

        //start sunrise/set calc loop
        setInterval(function(){ sunsetTime = getLocalSunset() }, 1800000);
        setInterval(function(){ sunriseTime = getLocalSunrise() }, 1800000);
        
        //start checklight loop
        setInterval(function(){ checkTurnLightOff(sunriseTime) }, 300000);
        setInterval(function(){ checkTurnLightOn(sunsetTime) }, 300000);
        
        console.log('starting lightSensor')
    },
};
