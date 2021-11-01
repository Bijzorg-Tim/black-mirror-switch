const axios = require("axios")

require('dotenv').config()

module.exports = {
    start: function (config) {
        console.log('starting switch')
        const functions = config.device_functions
        getDevicefunctionsStatus().then((response) => {
            console.log(response.data)
        }).catch((error) => {
            console.log(error)
        })

    },
}

function getDevicefunctionsStatus () {
    return axios({
        url: "http://" + process.env.BLACK_MIRROR_SERVER_URL + ":" + process.env.BLACK_MIRROR_SERVER_PORT + "/api/get-device-function-status",
        method: "GET",
    }).then((response) => {
        return Promise.resolve(response)
    }).catch((error) => {
        return Promise.reject(console.log(error))
    })
}

