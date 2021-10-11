const fs = require('fs')
const mainconfig = JSON.parse(fs.readFileSync('./mainconfig.json'))
const app = require('express')();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const Gpio = require('onoff').Gpio

require('dotenv').config()

server.listen(process.env.BLACK_MIRROR_SWITCH_PORT)

// app.post('/action', function (req, res) {
//     if (req.body.pin) {
//         const gebouw = req.body.pin.gebouw

//         if (req.body.action === true) {
            
//             for (let rel of req.body.pin.relais) {
//                 pins['pin' + relais[gebouw][rel.relais]].writeSync(1)
//             }
//         }

//         if (req.body.action === false) {
//             for (let rel of req.body.pin.relais) {
//                 pins['pin' + relais[gebouw][rel.relais]].writeSync(0)
//             }
//         }
        
//     }

//     res.send()
// })

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