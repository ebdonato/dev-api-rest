function existsOrError(value, msg) {
    if (!value) throw msg
    if (Array.isArray(value) && value.length === 0) throw msg
    if (typeof value === "string" && !value.trim()) throw msg
}

function notExistsOrError(value, msg) {
    try {
        existsOrError(value, msg)
    } catch (msg) {
        return
    }
    throw msg
}

function isDateOrError(value, msg) {
    const date = new Date(value)
    if (isNaN(date)) throw msg
}

function isValidCPFOrError(cpf, msg) {
    existsOrError(cpf, msg)

    let Soma = 0

    for (let i = 1; i <= 9; i++) Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (11 - i)

    let Resto = (Soma * 10) % 11

    if (Resto == 10 || Resto == 11) Resto = 0

    if (Resto != parseInt(cpf.substring(9, 10))) throw msg

    Soma = 0

    for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (12 - i)

    Resto = (Soma * 10) % 11

    if (Resto == 10 || Resto == 11) Resto = 0

    if (Resto != parseInt(cpf.substring(10, 11))) throw msg
}

function numberGreaterThanOrError(value, msg, {threshold = 0, inclusive = false} = {}) {
    isNumberOrError(value, msg)
    if (inclusive && value < threshold) throw msg
    if (!inclusive && value <= threshold) throw msg
}

function numberLowerThanOrError(value, msg, {threshold = 0, inclusive = false} = {}) {
    isNumberOrError(value, msg)
    if (inclusive && value > threshold) throw msg
    if (!inclusive && value >= threshold) throw msg
}

function isNumberOrError(value, msg) {
    if (typeof value !== "number") throw msg
    if (!isFinite(value)) throw msg
}

function isIntegerOrError(value, msg) {
    isNumberOrError(value, msg)
    if (!Number.isInteger(value)) throw msg
}

module.exports = {
    existsOrError,
    notExistsOrError,
    isValidCPFOrError,
    numberGreaterThanOrError,
    numberLowerThanOrError,
    isNumberOrError,
    isIntegerOrError,
    isDateOrError,
}
