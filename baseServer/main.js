const app = require('express')();
const server = require('http').Server(app);
const { exec } = require("child_process");
var backlight = {}

const Echo = require("laravel-echo")
global.Pusher = require("pusher-js")
require('dotenv').config()

module.exports = {
    start: function () {
        console.log('turning screen on')

        toggleScreenOn()

        console.log('starting webserver')
        server.listen(process.env.BASE_SERVER_PORT)
        
        app.use(function (req, res, next) {

            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', '*');
        
            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        
            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        
            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            res.setHeader('Access-Control-Allow-Credentials', true);
        
            // Pass to next layer of middleware
            next();
        });
        app.get('/toggle-screen-on', function (req, res) {
            toggleScreenOn()
            res.send()
        })

        app.get('/toggle-screen-off', function (req, res) {
            toggleScreenOff()
            res.send()
        })
    },
    turnon: function () {
        toggleScreenOn()
    },
    turnoff: function () {
        toggleScreenOff()
    }
}

function toggleScreenOn () {
    if (process.env.DEVELOPMENT === "true") {
        console.log('turning on screen')
    } else {
        exec('sudo "$(which node)" baseServer/turnOn.js', (error, stdout, stderr) => {
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
}

function toggleScreenOff() {
    if (process.env.DEVELOPMENT === "true") {
        console.log('turning off screen')
    } else {
        // exec("sudo /home/pi/.nvm/versions/node/v" + process.env.NODE_VERSION + "/bin/node baseServer/turnOff.js")
        exec('sudo "$(which node)" baseServer/turnOff.js', (error, stdout, stderr) => {
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
}