exports.up = function (knex) {
    return knex.schema
        .createTable("Pessoas", (table) => {
            table.increments("idPessoa").primary()
            table.string("nome").notNullable()
            table.string("cpf").notNullable()
            table.date("dataNascimento").notNullable()
        })
        .createTable("Contas", (table) => {
            table.increments("idConta").primary()
            table.integer("idPessoa").notNullable().unique().references("idPessoa").inTable("Pessoas")
            table.decimal("saldo").notNullable()
            table.decimal("limiteSaqueDiario").notNullable()
            table.boolean("flagAtivo").notNullable()
            table.integer("tipoConta").notNullable()
            table.date("dataCriacao").notNullable()
        })
        .createTable("Transacoes", (table) => {
            table.increments("idTransacao").primary()
            table.integer("idConta").notNullable().references("idConta").inTable("Pessoas")
            table.decimal("valor").notNullable()
            table.date("dataTransacao").notNullable()
        })
}

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("Transacoes").dropTableIfExists("Contas").dropTableIfExists("Pessoas")
}
