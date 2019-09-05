const moment = require("moment");

const time = () => () => moment().format("ddd, MMM Do YYYY, h:mm a");

const generateMessage = (from, text) => ({
    from,
    text,
    createdAt: time()()
})

const generateLocationMessage = (from, latitude, longitude) => ({
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: time()()
})

module.exports = {
    generateMessage,
    generateLocationMessage,
    time,
}