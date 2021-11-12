const prompt = require('prompt-sync')();
const sensor = require("node-dht-sensor");

const pininput = Number(prompt('Give GPIO-sensor-pin to test'));

console.log(sensor.read(22, pininput))