module.exports = (app) => {
    app.route("/pessoa/:idPessoa")
        .get(app.api.pessoas.getPerson)
        .put(app.api.pessoas.savePerson)
        .delete(app.api.pessoas.delPerson)

    app.route("/pessoa").post(app.api.pessoas.savePerson)
}
