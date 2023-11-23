type RequestHeaders = { [key: string]: string }

type RequestBody = { [key: string]: any }

// type Args = {
//   data?: any;
//   fields?: { [key: string]: any };
//   error?: { code: string; message: string; status?: number };
//   cache?: boolean;
//   status?: number;
// }

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
  async fetch<T = any>(url: string, options?: Options): Promise<any> {
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
      }
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
