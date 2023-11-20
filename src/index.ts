type RequestHeaders = { [key: string]: string }
type RequestBody = { [key: string]: any }
type Args = {
  data?: any;
  fields?: { [key: string]: any };
  error?: { code: string; message: string; status?: number };
  cache?: boolean;
  status?: number;
}
type Options = {
  credentials?: 'include' | 'omit' | 'same-origin'
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  cache?: 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached'
  headers?: RequestHeaders
  body?: RequestBody
  fields?: string[]
  addLocalHost?: boolean
}

const api = {
  async fetch(url: string, options?: Options): Promise<any> {
    const { method = 'GET', credentials = 'omit', fields = [], cache = 'no-cache', headers = { 'Content-Type': 'application/json' }, body = null } = options || {}
    const fetchOptions: any = {
      method,
      cache,
      headers,
      credentials
    }

    if (body) {
      fetchOptions.body = JSON.stringify(body)
    }

    if (options?.addLocalHost) {
      url = `http://localhost:3000${url}`
    }

    if (fields.length) {
      url = `${url}?fields=${fields.join(',')}`
    }

    try {
      const response = await fetch(url, fetchOptions)

      if (response.ok) {
        const data = await response.json()

        return data
      } else {
        await api.handleError(response)
        return api.handleResponse({
          error: {
            code: response.status.toString(),
            message: response.statusText,
            status: response.status
          }
        })
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      return api.handleResponse({
        error: {
          code: 'SERVER_ERROR',
          message: error?.toString() || 'Server error',
          status: 500
        }
      })
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
      return api.handleResponse({
        error: {
          code: 'SERVER_ERROR',
          message: error?.toString() || 'Server error',
          status: 500
        }
      })
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
      return api.handleResponse({
        error: {
          code: 'SERVER_ERROR',
          message: error?.toString() || 'Server error',
          status: 500
        }
      })
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
      return api.handleResponse({
        error: {
          code: 'SERVER_ERROR',
          message: error?.toString() || 'Server error',
          status: 500
        }
      })
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
      return api.handleResponse({
        error: {
          code: 'SERVER_ERROR',
          message: error?.toString() || 'Server error',
          status: 500
        }
      })
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
        system: { cache, fields: Object.keys(fields), error: true, status: error.status || 500 },
        response: {
          ok: false,
          error: {
            code: error.code,
            message: error.message,
            status: error.status || 500
          }
        }
      }
    }

    return {
      system: { cache, fields: Object.keys(fields), error: false, status: status || 200 },
      response: {
        ok: true,
        data
      }
    }
  }
}

export default api
