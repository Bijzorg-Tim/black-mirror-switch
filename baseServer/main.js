const app = require('express')();
const server = require('http').Server(app);
const { exec } = require("child_process");

require('dotenv').config()

module.exports = {
    start: function () {
        console.log('starting webserver')
        server.listen(process.env.BASE_SERVER_PORT)

        app.get('/reboot', function (req, res) {
            reboot()
            res.send('rebooting')
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
