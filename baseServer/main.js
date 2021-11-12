const app = require('express')();
const server = require('http').Server(app);
const { exec } = require("child_process");
var backlight = {}

if (process.env.DEVELOPMENT === "true") {
} else {
    backlight = require('rpi-backlight');
}

require('dotenv').config()

module.exports = {
    start: function () {
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

        app.get('/reboot', function (req, res) {
            reboot()
            res.send('rebooting')
        })

        app.get('/toggle-screen-on', function (req, res) {
            toggleScreenOn()
            res.send()
        })

        app.get('/toggle-screen-off', function (req, res) {
            toggleScreenOff()
            res.send()
        })

        app.get('/shutdown', function (req, res) {
            shutdown()
            res.send('shutting down')
        })

        app.get('/update', function (req, res) {
            update()
            res.send('starting update')
        })

        app.get('/restart', function (req, res) {
            restart()
            res.send('restarting')
        })
    },
}


function reboot () {
    exec("sudo reboot now", (error, stdout, stderr) => {
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

function update () {
    exec("git pull", (error, stdout, stderr) => {
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

    exec("npm install", (error, stdout, stderr) => {
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

    restart()
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

function shutdown () {
    exec("sudo shutdown now", (error, stdout, stderr) => {
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

function toggleScreenOn () {
    if (process.env.DEVELOPMENT === "true") {
        console.log('turning on screen')
    } else {
        backlight.powerOn();

    }
}

function toggleScreenOff() {
    if (process.env.DEVELOPMENT === "true") {
        console.log('turning off screen')
    } else {
        backlight.powerOff();

    }
}
