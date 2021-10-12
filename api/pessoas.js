module.exports = (app) => {
    const {existsOrError, notExistsOrError, isDateOrError, isValidCPFOrError} = app.utils.validation

    const savePerson = async (req, res) => {
        const person = {...req.body}

        try {
            if (req.params.idPessoa) {
                person.idPessoa = req.params.idPessoa

                const element = await app.db("Pessoas").where({idPessoa: person.idPessoa}).first()

                existsOrError(element, "ID Pessoa informada não está sendo usada")
            }

            existsOrError(person.nome, "Nome não informado")

            existsOrError(person.cpf, "CPF não informado")

            isValidCPFOrError(person.cpf, "CPF inválido")

            const element = await app
                .db("Pessoas")
                .where({cpf: person.cpf})
                .whereNot({idPessoa: person.idPessoa ?? 0})
                .first()

            notExistsOrError(element, "CPF informado já está sendo usado")

            existsOrError(person.dataNascimento, "Data de nascimento não informada")

            isDateOrError(person.dataNascimento, "Data de nascimento inválida")
        } catch (msg) {
            console.error(msg)
            return res.status(400).send(msg)
        }

        const db = app.db("Pessoas")

        const query = person.idPessoa ? db.update(person).where({idPessoa: person.idPessoa}) : db.insert(person)

        query
            .then(() => res.sendStatus(204))
            .catch((error) => {
                console.error(error)
                res.sendStatus(500)
            })
    }

    const getPerson = (req, res) => {
        app.db("Pessoas")
            .where({idPessoa: req.params.idPessoa})
            .first()
            .then((person) => {
                res.status(200).json(person)
            })
            .catch((err) => res.status(500).send(err))
    }

    const delPerson = (req, res) => {
        app.db("Pessoas")
            .where({idPessoa: req.params.idPessoa})
            .del()
            .then(() => res.status(204).send())
            .catch((err) => res.status(500).send(err))
    }

    return {
        savePerson,
        getPerson,
        delPerson,
    }
}
