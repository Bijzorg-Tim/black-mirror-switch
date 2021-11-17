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

module.exports = {
    start: function () {
        if (fs.existsSync(__dirname + '/deviceconfig.json')) {
            const config = JSON.parse(fs.readFileSync(__dirname + '/deviceconfig.json','utf8'))
            if (process.env.HAS_SCREEN === "true") {
                startBlackMirrorClient(config)
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
};

function startBlackMirrorClient(config) {
        if (process.env.DEVELOPMENT === "false") {
            exec("export DISPLAY=:0 && chromium-browser --kiosk http://" + process.env.BLACK_MIRROR_SERVER_URL + ":" + process.env.BLACK_MIRROR_SERVER_PORT +"/black-mirror-client/" + config.id, function(error, stdout, stderr) {
            console.log("stdout: " + stdout);
            console.log("stderr: " + stderr);
                if (error !== null) {
                    console.log("exec errror: " + error);
                }
            });
        } else {
            exec("export DISPLAY=:0 && chromium-browser http://" + process.env.BLACK_MIRROR_SERVER_URL + ":" + process.env.BLACK_MIRROR_SERVER_PORT +"/black-mirror-client/" + config.id , function(error, stdout, stderr) {
            console.log("stdout: " + stdout);
            console.log("stderr: " + stderr);
                if (error !== null) {
                    console.log("exec errror: " + error);
                }
            });
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
        fs.writeFileSync(__dirname + '/deviceconfig.json', JSON.stringify(req.body.config))
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