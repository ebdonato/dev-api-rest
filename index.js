const app = require("express")()

const consign = require("consign")

const knexConfig = require("./knexfile")

const knex = require("knex")(knexConfig[process.env.NODE_ENV ?? "development"]) // "development" or "production"

const port = process.env.PORT || 3000

knex.migrate.latest()

app.db = knex

consign()
    .include("./utils/middlewares.js")
    .then("./utils/validation.js")
    .then("./api")
    .then("./routes")
    .into(app)

app.all("*", (req, res) => {
    res.status(404).send("🚫 Rota Inválida 🚫")
})

app.listen(port, () => {
    console.log(`⚡ Aplicativo escutando a porta: ${port} ⚡`)
})
