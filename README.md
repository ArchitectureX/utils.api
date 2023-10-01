# @architecturex/utils.api

## api

This module provides a set of utility functions to simplify and standardize API calls using the Fetch API.

### Installation

`npm install @architecturex/utils.api`

### Methods

- **api.get(url: string, headers?: RequestHeaders):** Performs a GET request.
- **api.post(url: string, data: RequestBody, headers?: RequestHeaders):** Performs a POST request.
- **api.put(url: string, data: RequestBody, headers?: RequestHeaders):** Performs a PUT request.
- **api.delete(url: string, headers?: RequestHeaders):** Performs a DELETE request.
- **api.handleError(response: Response):** Handles errors based on the response status.
- **api.handleResponse(args: Args):** Returns a standardized response object.

### Types

- **RequestHeaders:** Object where the key is the header name and the value is the header value.
- **RequestBody:** Object representing any JSON serializable data.
- **Args:** Parameters for handleResponse including data, error, cache, and status.

### Usage

```javascript
import api from '@architecturex/utils.api'

// Performing a GET request
async function fetchData() {
  try {
    const data = await api.get('https://api.example.com/data')
    console.log(data)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

// Performing a POST request
async function postData(newData) {
  try {
    const response = await api.post('https://api.example.com/data', newData)
    console.log(response)
  } catch (error) {
    console.error('Error posting data:', error)
  }
}
```

### Response Handling

Both the `handleError` and `handleResponse` methods are provided to assist with error handling. handleError interprets the status code of the response and logs an appropriate error message. The handleResponse method, on the other hand, creates a standardized response object that can help streamline the handling of both successful and erroneous API calls in your application.

### Contribution

Feel free to suggest improvements, report issues, or contribute to enhancing this utility. Your feedback and contributions are welcome!
