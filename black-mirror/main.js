// const app = require('express')();
// const server = require('http').Server(app);
var express = require('express');
var app = express();
app.use(express.json());
const fs = require("fs")
const Gpio = require('onoff').Gpio
const { exec, spawn } = require('child_process');
const deviceCommands = require("./deviceCommands.js")

require('dotenv').config()

const Echo = require("laravel-echo")
global.Pusher = require("pusher-js")
const axios = require("axios")

const switchServer = require("./switch.js")
const cardreader = require("./cardReaderCommands.js")

var baseServer = require('../baseServer/main.js')


module.exports = {
    start: async function () {
        if (fs.existsSync(__dirname + '/deviceconfig.json')) {
            const config = JSON.parse(fs.readFileSync(__dirname + '/deviceconfig.json','utf8'))
            if (process.env.HAS_SCREEN === "true") {
                startBlackMirrorClient(config)
            } 
            
            if (process.env.CARD_READER === "true") {
                cardreader.start(config)
            } 
            
            switchServer.start(config)

            
        } else {
            if (process.env.HAS_SCREEN === "true") {
                getConfigFromBlackMirror()
            }  else {
                getConfigFromBlackMirrorWithoutScreen()
            }
            startListeningForConfigs()
        }
    },
    offline: async function () {
        baseServer.turnon()
        exec("pkill -f chromium-browser")
        await sleep(3000)
        exec("export DISPLAY=:0 && chromium-browser index.html");
    }
};



// async function ping() {
//     console.log("Hello");
//     var ca = await pingAxios().catch((response)=> {
//         return Promise.resolve(response);
//     })

//     .then((error) => {
//         return Promise.reject(error);
//     })

//     console.log(ca)
//     if (ca) {
//         ping()
//     } else {
//         // startBlackMirror()
//     }
//   }

async function startBlackMirrorClient(config) {
        exec("pkill -f chromium-browser")
        await sleep(3000)

        if (process.env.DEVELOPMENT === "false") {

            exec("export DISPLAY=:0 && chromium-browser --kiosk http://" + process.env.BLACK_MIRROR_SERVER_URL + ":" + process.env.BLACK_MIRROR_SERVER_PORT +"/black-mirror-client/" + config.id);
            // exec("export DISPLAY=:0 && chromium-browser --kiosk http://" + process.env.BLACK_MIRROR_SERVER_URL + ":" + process.env.BLACK_MIRROR_SERVER_PORT +"/black-mirror-client/" + config.id, function(error, stdout, stderr) {
            // console.log("stdout: " + stdout);
            // console.log("stderr: " + stderr);
            //     if (error !== null) {
            //         console.log("exec errror: " + error);
            //     }
            // });
        } else {
            // exec("export DISPLAY=:0 && chromium-browser http://" + process.env.BLACK_MIRROR_SERVER_URL + ":" + process.env.BLACK_MIRROR_SERVER_PORT +"/black-mirror-client/" + config.id , function(error, stdout, stderr) {
            // console.log("stdout: " + stdout);
            // console.log("stderr: " + stderr);
            //     if (error !== null) {
            //         console.log("exec errror: " + error);
            //     }
            // });

            exec("export DISPLAY=:0 && chromium-browser http://" + process.env.BLACK_MIRROR_SERVER_URL + ":" + process.env.BLACK_MIRROR_SERVER_PORT +"/black-mirror-client/" + config.id);
        }
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

        var configfile = req.body.config
        configfile.encryptionkey = req.body.encryptionKey

        fs.writeFileSync(__dirname + '/deviceconfig.json', JSON.stringify(configfile))
        deviceCommands.restart()
        res.send()
    })
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


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }