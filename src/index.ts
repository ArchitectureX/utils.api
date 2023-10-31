type RequestHeaders = { [key: string]: string }
type RequestBody = { [key: string]: any }
type Args = {
  data?: any
  error?: any
  fields?: any
  cache?: boolean
  status?: number
}
type Options = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  cache?: 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached'
  headers?: RequestHeaders
  body?: RequestBody
}

const api = {
  async fetch(url: string, options: Options): Promise<any> {
    const hasCache = options.cache !== 'no-cache'
    const { method = 'GET', cache = 'no-cache', headers = { 'Content-Type': 'application/json' }, body = null } = options
    const fetchOptions: any = {
      method,
      cache,
      headers
    }

    if (body) {
      fetchOptions.body = JSON.stringify(body)
    }

    try {
      const response = await fetch(url, fetchOptions)

      if (response.ok) {
        const data = await response.json()

        return api.handleResponse({
          data,
          cache: hasCache
        })
      } else {
        await api.handleError(response)
        return api.handleResponse({ error: response.statusText })
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      return api.handleResponse({ error })
    }
  },
  fields(fields: string, tableFields: any): any {
    const fieldArray: string[] = fields.split(',')
    const result: any = {}

    fieldArray.forEach((field) => {
      if (tableFields[field]) {
        result[field] = tableFields[field]
      }
    })

    return result
  },
  async get(url: string, headers?: RequestHeaders) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: headers
      })

      return response.json()
    } catch (error) {
      console.error('Failed to fetch data:', error)
      throw error
    }
  },
  async post(url: string, data: RequestBody, headers?: RequestHeaders) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(data)
      })

      return response.json()
    } catch (error) {
      console.error('Failed to post data:', error)
      throw error
    }
  },
  async put(url: string, data: RequestBody, headers?: RequestHeaders) {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(data)
      })

      return response.json()
    } catch (error) {
      console.error('Failed to update data:', error)
      throw error
    }
  },
  async delete(url: string, headers?: RequestHeaders) {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: headers
      })

      return response.json()
    } catch (error) {
      console.error('Failed to delete data:', error)
      throw error
    }
  },
  async handleError(response: Response) {
    const data = await response.json()

    switch (response.status) {
      case 400:
        console.error('Bad request:', data)
        break
      case 404:
        console.error('Not found:', data)
        break
      default:
        console.error('API call failed:', data)
    }
  },
  handleResponse({ data, fields = {}, error, cache = false, status = 200 }: Args) {
    if (error) {
      return {
        system: { cache, fields: Object.keys(fields), error: true, status: status || 500 },
        response: {
          error
        }
      }
    }

    return {
      system: { cache, fields: Object.keys(fields), error: false, status: status || 200 },
      response: {
        data
      }
    }
  }
}

export default api
