type RequestHeaders = { [key: string]: string }

type RequestBody = { [key: string]: any }

type Options = {
  credentials?: 'include' | 'omit' | 'same-origin'
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  cache?: 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached'
  headers?: RequestHeaders
  body?: RequestBody
  fields?: string[]
  addLocalHost?: boolean
}

type FetchRequestConfig = {
  url: string
  method?: string
  body?: any
  headers?: HeadersInit
  options?: RequestInit
}

type FetchRequest = FetchRequestConfig | ((response: any) => FetchRequestConfig);

const api = {
  async fetchChain(requests: FetchRequest[], addLocalHost?: boolean): Promise<{ [url: string]: any }> {
    let lastResponse: any = null
    const responses: { [url: string]: any } = {}
    const errors: Error[] = []

    for (let request of requests) {
      if (typeof request === 'function') {
        request = request(lastResponse)
      }

      if (addLocalHost) {
        request.url = `http://localhost:3000${request.url}`
      }

      try {
        const response = await fetch(request.url, {
          method: request.method || 'GET',
          body: request.body ? JSON.stringify(request.body) : null,
          headers: request.headers || { 'Content-Type': 'application/json' },
          ...request.options
        })

        if (!response.ok) {
          throw new Error(`Fetch to ${request.url} failed: ${response.status}`)
        }

        lastResponse = await response.json()
        responses[request.url.replace('http://localhost:3000', '')] = lastResponse
      } catch (error) {
        errors.push(error instanceof Error ? error : new Error(String(error)))

        break;
      }
    }

    return { lastResponse, responses, errors };
  },
  async fetch<T = any>(url: string, options?: Options): Promise<T> {
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

      const data: T = await response.json()

      return {
        cache: cache !== 'no-cache' && cache !== 'no-store',
        status: response.status,
        ...data
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      return {
        ok: false,
        cache: false,
        status: 500,
        error: {
          code: 'FETCH_ERROR',
          message: 'fetchError'
        }
      } as T
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
  }
}

export default api
