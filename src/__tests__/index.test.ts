import { jest, afterEach, describe, expect, it } from '@jest/globals'

import fetchMock from 'jest-fetch-mock'

import api from '../index'

// Global fetch mock
;(global.fetch as any) = fetchMock

describe('api', () => {
  afterEach(() => {
    fetchMock.resetMocks()
  })

  describe('handleResponse', () => {
    it('handles successful response', () => {
      const response = api.handleResponse({ data: 'some data', cache: true, status: 200 })
      expect(response).toEqual({
        response: { ok: true, cache: true, status: 200, data: 'some data' }
      })
    })

    it('handles error response', () => {
      const response = api.handleResponse({
        error: {
          code: 'SERVER_ERROR',
          message: 'Error: fake error message',
          status: 500
        },
        cache: false,
        status: 500
      })

      expect(response).toEqual({
        response: {
          ok: false,
          cache: false,
          status: 500,
          data: {},
          error: {
            code: 'SERVER_ERROR',
            message: 'Error: fake error message'
          }
        }
      })
    })
  })
})
