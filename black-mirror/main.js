// const app = require('express')();
// const server = require('http').Server(app);
var express = require('express');
var app = express();
app.use(express.json());
const fs = require("fs")
const Gpio = require('onoff').Gpio
const { exec } = require('child_process');

require('dotenv').config()

const Echo = require("laravel-echo")
global.Pusher = require("pusher-js")
const axios = require("axios")

const switchServer = require("./switch.js")

module.exports = {
    start: function () {
        if (fs.existsSync(__dirname + '/deviceconfig.json')) {
            if (process.env.HAS_SCREEN) {
                startBlackMirrorClient()
            } 
            const config = JSON.parse(fs.readFileSync(__dirname + '/deviceconfig.json','utf8'))
            switchServer.start(config)
            
        } else {
            if (process.env.HAS_SCREEN === "true") {
                getConfigFromBlackMirror()
            }  else {
                getConfigFromBlackMirrorWithoutScreen()
            }
            startListeningForConfigs()
        }
        // console.log('starting webserver')
        // server.listen(process.env.BLACK_MIRROR_SWITCH_PORT)

        // app.get('/on', function (req, res) {
            
        //     const pins = process.env.LIGHT_PINS_ARRAY.split(',')

        //     pins.forEach(pin => {
        //         var led = new Gpio(parseInt(pin), 'out');
        //         led.writeSync(1)
        //     });

        //     res.send()

        // })

        // app.get('/off', function (req, res) {
        
        //     const pins = process.env.LIGHT_PINS_ARRAY.split(',')

        //     pins.forEach(pin => {
        //         var led = new Gpio(parseInt(pin), 'out');
        //         led.writeSync(0)
        //     });

        //     res.send()
        // })
    },
};

function startBlackMirrorClient() {
        exec("export DISPLAY=:0 && chromium-browser --kiosk http://" + process.env.BLACK_MIRROR_SERVER_URL + ":" + process.env.BLACK_MIRROR_SERVER_PORT +"/black-mirror-client/1", function(error, stdout, stderr) {
        console.log("stdout: " + stdout);
        console.log("stderr: " + stderr);
        if (error !== null) {
            console.log("exec errror: " + error);
        }
    });
}

function getConfigFromBlackMirror() {
        exec("export DISPLAY=:0 && chromium-browser --kiosk http://" + process.env.BLACK_MIRROR_SERVER_URL + ":" + process.env.BLACK_MIRROR_SERVER_PORT + "/black-mirror-client/get-device-config", function(error, stdout, stderr) {
        console.log("stdout: " + stdout);
        console.log("stderr: " + stderr);
        if (error !== null) {
            console.log("exec errror: " + error);
        }
    });
}

function startListeningForConfigs () {
    app.listen(process.env.CONFIG_LISTEN_SERVER_LOCAL_PORT)
    app.post('/set-setup', function (req, res) {
        fs.writeFileSync(__dirname + '/deviceconfig.json', JSON.stringify(req.body.config))
        restart()
        res.send()
    })
}

function restart () {
    exec("pm2 restart all", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}




function getConfigFromBlackMirrorWithoutScreen () {
    const id = this.id = Math.floor(Math.random() * 1000000);
    console.log(id)
    
    const echo = new Echo({
        broadcaster: "pusher",
        key: "your-pusher-key",
        wsHost: process.env.BLACK_MIRROR_SERVER_URL,
        wsPort: 6001,
        forceTLS: false,
        disableStats: true
      });

      echo.channel("setupchannel").listen(".get-all-setup-devices", message => {
        sendIdToServer(id)
      });
}

function sendIdToServer (id) {

    const data = {
        id: id
    }
    return axios({
        url: "http://" + process.env.BLACK_MIRROR_SERVER_URL + ":" + process.env.BLACK_MIRROR_SERVER_PORT + "/api/ready-for-config",
        method: "POST",
        data: data,
    })
    .then(function(response) {
        console.log(response.data)
    return Promise.resolve(response);
    })
    .catch(function(error) {
        console.log(error.data)
    return Promise.reject(error);
    });

}