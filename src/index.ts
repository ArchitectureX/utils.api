type RequestHeaders = { [key: string]: string }
type RequestBody = { [key: string]: any }
type Args = {
  data?: any
  error?: any
  cache?: boolean
  status?: number
}

const api = {
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
  handleResponse({ data, error, cache = false, status = 200 }: Args) {
    if (error) {
      return {
        system: { cache, error: true, status: status || 500 },
        response: {
          error
        }
      }
    }

    return {
      system: { cache, error: false, status: status || 200 },
      response: {
        data
      }
    }
  }
}

export default api
