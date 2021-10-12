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
        connection: {
            database: "banco",
            user: "postgres",
            password: "123456",
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "knex_migrations",
        },
    },
}
