const BASE_URL = 'http://localhost:3001'; // Adjust port as needed

export const fetcher = async ({
  url,
  method = 'GET',
  params = {},
  options = {}
}) => {
  const requestOptions = {
    method,
    credentials: 'include', // Add credentials to handle cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  // Add body for non-GET requests
  if (method !== 'GET' && params) {
    requestOptions.body = JSON.stringify(params);
  }

  // For GET requests, append params to URL
  const queryParams = method === 'GET' && params ? 
    `?${new URLSearchParams(params).toString()}` : '';

  try {
    const response = await fetch(`${BASE_URL}${url}${queryParams}`, requestOptions);
    
    const json = await response.json();
    if (!response.ok) {
      throw { code: response.status, message: json.message || 'An error occurred' };
    }
    
    return json;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};
