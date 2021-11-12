const prompt = require('prompt-sync')();
const Gpio = require('onoff').Gpio


const pininput = Number(prompt('Give GPIO to test'));

var pin = new Gpio(pininput, 'out')
console.log('turning pin ' + pin + ' on.')
pin.writeSync(1)

setTimeout(function(){ 
    console.log('turning pin ' + pin + ' off.')
    pin.writeSync(0)
 }, 3000);
