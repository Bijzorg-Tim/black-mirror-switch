const fs = require('fs')
const mainconfig = JSON.parse(fs.readFileSync('./mainconfig.json'))
const app = require('express')();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const Gpio = require('onoff').Gpio

const pins = {}

pins.pin2 = new Gpio(2, 'out')
pins.pin2.writeSync(0)
pins.pin3 = new Gpio(3, 'out')
pins.pin3.writeSync(0)
pins.pin4 = new Gpio(4, 'out')
pins.pin4.writeSync(0)
pins.pin5 = new Gpio(5, 'out')
pins.pin5.writeSync(0)
pins.pin6 = new Gpio(6, 'out')
pins.pin6.writeSync(0)
pins.pin7 = new Gpio(7, 'out')
pins.pin7.writeSync(0)
pins.pin8 = new Gpio(8, 'out')
pins.pin8.writeSync(0)
pins.pin9 = new Gpio(9, 'out')
pins.pin9.writeSync(0)
pins.pin10 = new Gpio(10, 'out')
pins.pin10.writeSync(0)
pins.pin11 = new Gpio(11, 'out')
pins.pin11.writeSync(0)
pins.pin12 = new Gpio(12, 'out')
pins.pin12.writeSync(0)
pins.pin13 = new Gpio(13, 'out')
pins.pin13.writeSync(0)
pins.pin14 = new Gpio(14, 'out')
pins.pin14.writeSync(0)
pins.pin15 = new Gpio(15, 'out')
pins.pin15.writeSync(0)
pins.pin16 = new Gpio(16, 'out')
pins.pin16.writeSync(0)
pins.pin17 = new Gpio(17, 'out')
pins.pin17.writeSync(0)
pins.pin18 = new Gpio(18, 'out')
pins.pin18.writeSync(0)
pins.pin19 = new Gpio(19, 'out')
pins.pin19.writeSync(0)
pins.pin20 = new Gpio(20, 'out')
pins.pin20.writeSync(0)
pins.pin21 = new Gpio(21, 'out')
pins.pin21.writeSync(0)
pins.pin22 = new Gpio(22, 'out')
pins.pin22.writeSync(0)
pins.pin23 = new Gpio(23, 'out')
pins.pin23.writeSync(0)
pins.pin24 = new Gpio(24, 'out')
pins.pin24.writeSync(0)
pins.pin25 = new Gpio(25, 'out')
pins.pin25.writeSync(0)
pins.pin26 = new Gpio(26, 'out')
pins.pin26.writeSync(0)
pins.pin27 = new Gpio(27, 'out')
pins.pin27.writeSync(0)

// Kas switch gedeelte
const relais = {
    kas: {
        1: 21,
        2: 20,
        3: 26,
        4: 16,
        5: 19,
        6: 13,
        7: 12,
        8: 6,
        9: 5,
        10: 7,
        11: 8,
        12: 11,
        13: 25,
        14: 9,
        15: 10,
        16: 24,
        17: 23,
        18: 22
    }
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
server.listen(mainconfig.client_server_port)

app.post('/action', function (req, res) {
    if (req.body.pin) {
        const gebouw = req.body.pin.gebouw

        if (req.body.action === true) {
            
            for (let rel of req.body.pin.relais) {
                pins['pin' + relais[gebouw][rel.relais]].writeSync(1)
            }
        }

        if (req.body.action === false) {
            for (let rel of req.body.pin.relais) {
                pins['pin' + relais[gebouw][rel.relais]].writeSync(0)
            }
        }
        
    }

    res.send()
})

app.get('/test', function (req, res) {
    
    for (let rel in relais.kas) {
        pins['pin' + relais.kas[rel]].writeSync(1)
    }

    setTimeout(function(){
        pins['pin' + relais.kas[rel]].writeSync(0) 
     }, 3000);

    res.send()
})