const moment = require("moment");

const time = () => () => moment().format("ddd, MMM Do YYYY, h:mm a");

const generateMessage = (from, text) => ({
    from,
    text,
    createdAt: time()()
})

module.exports = {
    generateMessage,
    time,
}