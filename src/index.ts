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

export type APIResponse<T = object> = {
  ok: boolean
  data: T
  status: number
  cache: boolean
  error?: {
    code: string
    message?: string
  }
}

const api = {
  async fetch<T = any>(url: string, options?: Options): Promise<APIResponse<T>> {
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
        const data: T = await response.json()

        return {
          ok: true,
          cache: cache !== 'no-cache' && cache !== 'no-store',
          status: response.status,
          data,
          error: undefined
        }
      } else {
        return api.handleResponse<T>({
          status: response.status,
          error: {
            code: response.status.toString(),
            message: response.statusText
          }
        })
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      return api.handleResponse<T>({
        status: 500,
        error: {
          code: 'SERVER_ERROR',
          message: error?.toString() || 'Server error',
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
  handleResponse<T = object>({ data, error, cache = false, status = 200 }: Args): APIResponse<T> {
    if (error) {
      return {
        ok: false,
        cache,
        status: status || 500,
        data: {} as T,
        error: {
          code: error.code,
          message: error.message
        }
      }
    }

    return {
      ok: true,
      cache,
      status: status || 200,
      data: data as T,
      error: undefined
    }
  }
}

export default api
