require('dotenv').config()
const { exec, spawn } = require('child_process');
const axios = require("axios");
const fs = require("fs")

module.exports = {
    restart: function (config) {
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
    },
    reboot: function (config) {
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
    },
    shutdown: function (config) {
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
    },
    update: function (config) {
        exec("git pull && npm install && pm2 restart all", (error, stdout, stderr) => {
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
    },
    updateConfig: function (config) {
        const data = {
            id: config.id
        }
        return axios({
            url: "http://" + process.env.BLACK_MIRROR_SERVER_URL + ":" + process.env.BLACK_MIRROR_SERVER_PORT + "/api/update-config",
            method: "POST",
            data: data,
        })
        .then(function(response) {
            fs.writeFileSync('black-mirror/deviceconfig.json', JSON.stringify(response.data))
        return Promise.resolve(response);
        })
        .catch(function(error) {
            console.log(error.data)
        return Promise.reject(error);
        });

    },
    deleteConfig: function (config) {
        exec("rm black-mirror/deviceconfig.json && pm2 restart all", (error, stdout, stderr) => {
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
    },
}