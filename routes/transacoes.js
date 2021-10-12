module.exports = (app) => {
    app.route("/extrato/:idConta").get(app.api.transacoes.getExtract)
}
