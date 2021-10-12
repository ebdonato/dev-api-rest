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

function equalsOrError(valueA, valueB, msg) {
    if (valueA !== valueB) throw msg
}

function notEqualsOrError(valueA, valueB, msg) {
    if (valueA === valueB) throw msg
}

function atLeastOneOrError(valuesArray, msg) {
    if (!valuesArray.some((el) => !!el)) throw msg
}

function exclusiveOrError(valuesArray, msg) {
    if (valuesArray.filter((el) => !!el).length != 1) throw msg
}

function onlyNumbersOrError(value, msg) {
    const re = /^[0-9]+$/
    if (!re.test(value)) throw msg
}

function validEmailOrError(value, msg) {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!re.test(String(value).toLowerCase())) throw msg
}

function validPhoneNumberOrError(value, msg) {
    const re = /\d{10,11}/
    if (!re.test(String(value).toLowerCase())) throw msg
}

function includeOrError(value, valuesArray, msg) {
    if (!Array.isArray(valuesArray) || !valuesArray.includes(value)) throw msg
}

function allOrNoneOrError(valuesArray, msg) {
    if (!valuesArray.every((el) => !!el) && !valuesArray.every((el) => !el)) throw msg
}

module.exports = {
    existsOrError,
    notExistsOrError,
    equalsOrError,
    isValidCPFOrError,
    notEqualsOrError,
    exclusiveOrError,
    atLeastOneOrError,
    onlyNumbersOrError,
    validEmailOrError,
    numberGreaterThanOrError,
    numberLowerThanOrError,
    allOrNoneOrError,
    isNumberOrError,
    isIntegerOrError,
    isDateOrError,
    validPhoneNumberOrError,
    includeOrError,
}
