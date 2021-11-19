"use strict";
const Mfrc522 = require("mfrc522-rpi");
const SoftSPI = require("rpi-softspi");


module.exports = {
    read: function (key) {

    },
    writeToCard: function (key, data) {
        writeToCard(key, data)
    },
};

function writeToCard (key, data) {

    var writeinterval = setInterval(function() {

    const softSPI = new SoftSPI({
        clock: 23, // pin number of SCLK
        mosi: 19, // pin number of MOSI
        miso: 21, // pin number of MISO
        client: 24 // pin number of CS
    });

    // GPIO 24 can be used for buzzer bin (PIN 18), Reset pin is (PIN 22).
    // I believe that channing pattern is better for configuring pins which are optional methods to use.
    const mfrc522 = new Mfrc522(softSPI).setResetPin(22).setBuzzerPin(18);

    //# reset card
    mfrc522.reset();

    //# Scan for cards
    let response = mfrc522.findCard();
    if (!response.status) {
        return;
    }

    console.log("Card detected, CardType: " + response.bitSize);

    //# Get the UID of the card
    response = mfrc522.getUid();
    if (!response.status) {
        console.log("UID Scan Error");
        return;
    } else {

        //# If we have the UID, continue
        const uid = response.data;

        //# Select the scanned card
        const memoryCapacity = mfrc522.selectCard(uid);
        console.log("Card Memory Capacity: " + memoryCapacity);

        //# oldKey is the default key for authentication
        const oldKey = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];
        const newKey = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];

        //# Authenticate on Block 11 with key and uid
        if (mfrc522.authenticate(11, oldKey, uid)) {
            mfrc522.writeAuthenticationKey(11, newKey);
        }

        const data = [
            124,12,4,14
        ]

        mfrc522.writeDataToBlock(8, data);

        //get data
        console.log("data on block 8: " + mfrc522.getDataForBlock(8));

        mfrc522.stopCrypto();

        //send write secces
        
        //stop loop
        clearInterval(writeinterval)

    }
    process.exit();
    
    }, 500);
}