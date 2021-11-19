const cardreader = require("./black-mirror/cardReaderCommands")

const key = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff]
const data = [12,4,6,1,2,3,4,8]

cardreader.writeToCard(key, data)