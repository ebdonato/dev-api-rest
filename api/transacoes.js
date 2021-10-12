module.exports = (app) => {
    const {existsOrError, isDateOrError} = app.utils.validation

    const getExtract = async (req, res) => {
        const idConta = req.params.idConta

        const {de: to, ate: from} = {...req.body}

        try {
            const element = await app.db("Contas").where({idConta}).first()

            existsOrError(element, "ID Conta informada não está sendo usada")

            !!to && isDateOrError(to, "Data 'De' inválida")

            !!to && existsOrError(from, "Data 'Até' não informada")

            !!from && isDateOrError(from, "Data 'Até' inválida")

            !!from && existsOrError(to, "Data 'De' não informada")
        } catch (msg) {
            console.error(msg)
            return res.status(400).send(msg)
        }

        app.db("Transacoes")
            .where((builder) => {
                builder = builder.where({idConta})

                if (!!to && !!from) {
                    builder = builder.whereBetween("dataTransacao", [to, from])
                }

                return builder
            })
            .then((transactions) => {
                res.status(200).json(transactions)
            })
            .catch((err) => res.status(500).send(err))
    }

    return {
        getExtract,
    }
}
