'use strict'
const createError = require('http-errors')

function assertRes ({ res }) {
  if (String(res.status).startsWith('2')) return res.data

  if (!res.data) throw createError(res.status)

  const { error, message, data } = res.data
  if (error) throw createError(res.status, error, { message, data })

  throw createError(res.status, String(res.data))
}

function assertResultWithError ({ res }) {
  if (String(res.status).startsWith('2')) return res.data.result

  if (!res.data) throw createError(res.status)

  const { result, error } = res.data
  if (!error) return result

  throw createError(res.status, error.error, { message: error.message })
}

module.exports = { assertRes, assertResultWithError }