require("dotenv").config()

module.exports = {
    development: {
        client: "sqlite3",
        connection: {
            filename: "./dev.sqlite3",
        },
    },

    production: {
        client: "postgresql",
        connection: process.env.PG_CONNECTION_STRING || "postgres://postgres:123456@localhost:5432/banco",
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "knex_migrations",
        },
    },
}
