exports.up = (knex) => {
    return knex("Pessoas").insert({
        nome: "Fulano de Tal",
        cpf: "11111111111",
        dataNascimento: "1982-08-28",
    })
}

exports.down = (knex) => {
    return knex("Pessoas").where("cpf", "11111111111").del()
}
