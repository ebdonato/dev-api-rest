const helmet = require("helmet")

const morgan = require("morgan")

const bodyParser = require("body-parser")

module.exports = (app) => {
    // requisition body parser
    app.use(bodyParser.json())

    // logs
    app.use(morgan("common"))

    //helmet
    app.use(helmet())
}
