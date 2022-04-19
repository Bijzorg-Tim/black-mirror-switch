// var test = require('./test');
var lightsensor = require('./lightSensor/main.js')
var blackmirror = require('./black-mirror/main.js')
var baseServer = require('./baseServer/main.js')
require('dotenv').config()
const { exec, spawn } = require('child_process');

const Monitor = require("ping-monitor");

var isServerRunning = false


baseServer.start()

// exec("chromium-browser index.html")
exec("export DISPLAY=:0 && chromium-browser index.html");

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }
  

//   var pingFunction = ping();

var interval = 300; 
if (process.env.PING_REPEAT_IN_SECONDS) {
    interval = process.env.PING_REPEAT_IN_SECONDS
} 

const toegang = new Monitor({
    website: 'http://' + process.env.BLACK_MIRROR_SERVER_URL + ":" +  process.env.BLACK_MIRROR_SERVER_PORT,
    title: 'Black mirror server',
    interval: interval,

    config: {
      intervalUnits: 'seconds' // seconds, milliseconds, minutes {default}, hours
    },

    httpOptions: {
      path: '/api/ping',
      method: 'get',
    },
    expect: {
      statusCode: 200
    }
});

toegang.on('up', function (res, state) {
    if (!isServerRunning) {
        exec("pkill -f chromium-browser")
        blackmirror.start()
        console.log('starting black mirror')
        isServerRunning = true
    }
});

toegang.on('down', function (res, state) {
    if (isServerRunning) {
        console.log('stopping black mirror')
        blackmirror.offline()
        isServerRunning = false
    }
});

toegang.on('error', function (error, res) {
    if (isServerRunning) {
        console.log('stopping black mirror')
        blackmirror.offline()
        isServerRunning = false
    }
});

toegang.on('timeout', function (error, res) {
    if (isServerRunning) {
        console.log('stopping black mirror')
        blackmirror.offline()
        isServerRunning = false
    }
});

// ping().then(() => {
//     console.log('yes')
// }).catch(() => {
//     console.log('no')
// })



// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }

// .then((response) => {
    //     blackmirror.start()
    // })
    // .catch(() => {
    //     setTimeout(checkIfOnline(), 1000);
    //     console.log('error')
    // })


// if (process.env.BLACK_MIRROR_SWITCH === "true") {
// }

// if (process.env.LIGHT_TOGGLE_SENSOR === "true") {
//     lightsensor.start()
// }

// if (process.env.TEMP_SENSOR === "true") {
//     console.log('test')
// }

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
  


// function pingAxios () {
//         // const token = rootGetters["auth/token"];
//         // const user = rootGetters["auth/user"];
//         return axios({
//           url: 'http://' +process.env.BLACK_MIRROR_SERVER_URL + ":" +  process.env.BLACK_MIRROR_API_PORT + "/api/ping",
//           method: "GET",
//         })
//         .then(function(response) {
//             return Promise.resolve(response);
//         })
//         .catch(function(error) {
//             return Promise.reject(error);
//         });
// }
