const app = require('express')();
const server = require('http').Server(app);
const Gpio = require('onoff').Gpio

require('dotenv').config()



module.exports = {
    start: function () {
        console.log('starting webserver')
        server.listen(process.env.BLACK_MIRROR_SWITCH_PORT)

        app.get('/on', function (req, res) {
            
            const pins = process.env.LIGHT_PINS_ARRAY.split(',')

            pins.forEach(pin => {
                var led = new Gpio(parseInt(pin), 'out');
                led.writeSync(1)
            });

            res.send()

        })

        app.get('/off', function (req, res) {
        
            const pins = process.env.LIGHT_PINS_ARRAY.split(',')

            pins.forEach(pin => {
                var led = new Gpio(parseInt(pin), 'out');
                led.writeSync(0)
            });

            res.send()
        })
    },
};
