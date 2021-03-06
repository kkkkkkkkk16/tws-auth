'use strict'
const EventEmitter = require('events')
const assert = require('power-assert')
const tman = require('tman')
const Store = require('../../lib/cache/store')

tman.suite('cache - store', function () {
  let store = new Store()

  tman.it('should extend EventEmitter', function () {
    assert(store instanceof EventEmitter)
  })

  tman.it('should throw when not implement store.get()', function () {
    assert.throws(() => store.get(),
                  'store.get() should be implemented manually')
  })

  tman.it('should throw when not implement store.set()', function () {
    assert.throws(() => store.set(),
                  'store.set() should be implemented manually')
  })
})
