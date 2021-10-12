module.exports = (app) => {
    const {existsOrError, notExistsOrError, isDateOrError, numberLowerThanOrError, isNumberOrError} =
        app.utils.validation

    const saveAccount = async (req, res) => {
        const account = {...req.body}

        try {
            if (req.params.idConta) {
                account.idConta = req.params.idConta

                const element = await app.db("Contas").where({idConta: account.idConta}).first()

                existsOrError(element, "ID Conta informada não está sendo usada")

                delete account.saldo

                delete account.idPessoa
            } else {
                account.saldo = 0

                existsOrError(account.idPessoa, "ID Pessoa não informada")

                const element = await app.db("Contas").where({idPessoa: account.idPessoa}).first()

                notExistsOrError(element, "ID Pessoa informada não está sendo usada")
            }

            existsOrError(account.limiteSaqueDiario, "Limite de saque diário não informado")

            existsOrError(account.tipoConta, "Tipo da conta não informado")

            existsOrError(account.dataCriacao, "Data de criação não informada")

            isDateOrError(account.dataCriacao, "Data de criação inválida")
        } catch (msg) {
            console.error(msg)
            return res.status(400).send(msg)
        }

        account.flagAtivo = !!account.flagAtivo

        account.tipoConta = +account.tipoConta

        account.limiteSaqueDiario = +account.limiteSaqueDiario

        const db = app.db("Contas")

        const query = account.idConta ? db.update(account).where({idConta: account.idConta}) : db.insert(account)

        query
            .then(() => res.sendStatus(204))
            .catch((error) => {
                console.error(error)
                res.sendStatus(500)
            })
    }

    const getAccount = (req, res) => {
        app.db("Contas")
            .where({idConta: req.params.idConta})
            .first()
            .then((account) => {
                res.status(200).json(account)
            })
            .catch(() => res.res.sendStatus(500))
    }

    const delAccount = (req, res) => {
        app.db("Contas")
            .where({idConta: req.params.idConta})
            .del()
            .then(() => res.sendStatus(204))
            .catch(() => res.res.sendStatus(500))
    }

    const getAccountBalance = async (req, res) => {
        const idConta = req.params.idConta

        try {
            const element = await app.db("Contas").where({idConta}).first()

            existsOrError(element, "ID Conta informada não está sendo usada")
        } catch (msg) {
            console.error(msg)
            return res.status(400).send(msg)
        }

        app.db("Contas")
            .where({idConta})
            .first()
            .then((balance) => {
                const {saldo} = balance
                res.status(200).json({
                    idConta,
                    saldo,
                })
            })
            .catch(() => res.res.sendStatus(500))
    }

    const accountTransaction = async (req, res) => {
        const idConta = req.params.idConta

        const {valor} = {...req.body}

        const account = await app.db("Contas").where({idConta}).first()

        const dataTransacao = new Date().toJSON().split("T")[0]

        try {
            existsOrError(valor, "Valor para depósito zero ou não informado")

            isNumberOrError(valor, "Valor para depósito inválido")

            existsOrError(account, "ID Conta informada não está sendo usada")

            existsOrError(account.flagAtivo, "Conta informada não está ativa")

            if (valor < 0) {
                numberLowerThanOrError(-valor, "Saldo insuficiente", {
                    threshold: account.saldo,
                    inclusive: true,
                })

                const {withdraws = 0} = await app
                    .db("Transacoes")
                    .where({idConta, dataTransacao})
                    .where("valor", "<", 0)
                    .sum("valor as withdraws")
                    .first()

                const withdrawRemaining = account.limiteSaqueDiario + withdraws

                numberLowerThanOrError(
                    -valor,
                    `Valor excede limite diário de saque. Saque restante: R$ ${withdrawRemaining}`,
                    {
                        threshold: withdrawRemaining,
                        inclusive: true,
                    }
                )
            }
        } catch (msg) {
            console.error(msg)
            return res.status(400).send(msg)
        }

        const saldo = account.saldo + +valor

        const trx = await app.db.transaction()

        try {
            await trx("Contas").update({saldo}).where({idConta})

            await trx("Transacoes").insert({idConta, valor, dataTransacao})

            await trx.commit()

            return res.status(200).json({
                idConta,
                saldo,
            })
        } catch (error) {
            console.error(error)

            await trx.rollback()

            return res.sendStatus(500)
        }
    }

    const changeAccountStatus = async (req, res) => {
        const idConta = req.params.idConta

        const {ativo} = {...req.body}

        const account = await app.db("Contas").where({idConta}).first()

        try {
            existsOrError(account, "ID Conta informada não está sendo usada")
        } catch (msg) {
            console.error(msg)
            return res.status(400).send(msg)
        }

        app.db("Contas")
            .update({flagAtivo: !!ativo})
            .where({idConta})
            .then(() =>
                res.status(200).json({
                    idConta,
                    flagAtivo: !!ativo,
                })
            )
            .catch((error) => {
                console.error(error)
                res.sendStatus(500)
            })
    }

    return {
        saveAccount,
        getAccount,
        delAccount,
        getAccountBalance,
        accountTransaction,
        changeAccountStatus,
    }
}
