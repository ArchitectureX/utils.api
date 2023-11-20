import { jest, afterEach, describe, expect, it } from '@jest/globals'

import fetchMock from 'jest-fetch-mock'

import api from '../index'

// Global fetch mock
;(global.fetch as any) = fetchMock

describe('api', () => {
  afterEach(() => {
    fetchMock.resetMocks()
  })

  describe('get', () => {
    it('fetches data successfully', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: 'some data' }))
      const result = await api.get('https://api.example.com/data')
      expect(result).toEqual({ data: 'some data' })
    })

    it('throws an error when fetch fails', async () => {
      fetchMock.mockReject(new Error('fake error message'))

      const response = await api.get('https://api.example.com/data')

      expect(response).toEqual({
        system: { cache: false, fields: [], error: true, status: 500 },
        response: {
          ok: false,
          error: {
            code: 'SERVER_ERROR',
            message: 'Error: fake error message',
            status: 500
          }
        }
      })
    })
  })

  describe('post', () => {
    it('posts data successfully', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ success: true }))
      const result = await api.post('https://api.example.com/data', { name: 'test' })
      expect(result).toEqual({ success: true })
    })
  })

  describe('handleError', () => {
    it('handles a 400 Bad Request', async () => {
      const mockResponse = new Response(JSON.stringify({ message: 'Bad Request' }), {
        status: 400
      })
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      await api.handleError(mockResponse)
      expect(consoleErrorSpy).toHaveBeenCalledWith('Bad request:', { message: 'Bad Request' })
      consoleErrorSpy.mockRestore()
    })
  })

  describe('handleResponse', () => {
    it('handles successful response', () => {
      const response = api.handleResponse({ data: 'some data', cache: true, status: 200 })
      expect(response).toEqual({
        system: { cache: true, fields: [], error: false, status: 200 },
        response: { ok: true, data: 'some data' }
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
        system: { cache: false, fields: [], error: true, status: 500 },
        response: {
          ok: false,
          error: {
            code: 'SERVER_ERROR',
            message: 'Error: fake error message',
            status: 500
          }
        }
      })
    })
  })
})
