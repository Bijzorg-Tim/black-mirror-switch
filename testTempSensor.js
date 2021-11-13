const prompt = require('prompt-sync')();
const sensor = require("node-dht-sensor");
const Gpio = require('onoff').Gpio

const pininput = Number(prompt('Give GPIO-sensor-pin to test'));


var pin = new Gpio(27, 'out')
pin.writeSync(1)
console.log(sensor.read(22, pininput))