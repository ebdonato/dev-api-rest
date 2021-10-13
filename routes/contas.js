module.exports = (app) => {
    app.route("/conta/:idConta")
        .get(app.api.contas.getAccount)
        .put(app.api.contas.saveAccount)
        .delete(app.api.contas.delAccount)

    app.route("/conta/:idConta/saldo").get(app.api.contas.getAccountBalance)

    app.route("/conta/:idConta/movimentar").put(app.api.contas.accountTransaction)

    app.route("/conta/:idConta/ativar-desativar").put(app.api.contas.changeAccountStatus)

    app.route("/conta").post(app.api.contas.saveAccount)
}
