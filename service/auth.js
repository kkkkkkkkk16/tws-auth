'use strict'
const co = require('co')
const urllib = require('urllib')
const jwt = require('jsonwebtoken')
const { assertRes } = require('../util/request')

const FIVE_MINUTES = 5 * 60

class Auth {
  constructor (options) {
    this.options = options
  }

  authorize () {
    return co(function * () {
      if (this.options.cacheStore) {
        const token = yield this.options.cacheStore.get(this.options.appId)
        if (token) return token
      }

      const token = jwt.sign({ _appId: this.options.appId },
                             this.options.appSecret)

      const data = assertRes(yield urllib
        .request(`${this.options.host}/v1/apps/authorize`, {
          method: 'POST',
          contentType: 'json',
          dataType: 'json',
          timeout: this.options.timeout,
          data: {
            _appId: this.options.appId,
            resourceId: this.options.appId,
            resourceType: this.options.resourceType,
            name: 'tws-auth',
            grantType: 'client_credentials'
          },
          headers: { Authorization: `Bearer ${token}` }
        }))

      if (this.options.cacheStore) {
        yield this.options.cacheStore.set(this.options.appId, data.access_token,
          data.expiresIn > FIVE_MINUTES
                           ? data.expiresIn - FIVE_MINUTES
                           : data.expiresIn
        )
      }

      return data.access_token
    }.bind(this))
  }
}

module.exports = Auth
