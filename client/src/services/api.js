async function apiRequest(path, method = 'GET', body) {
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json' }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    method,
    headers,
    body: JSON.stringify(body)
  })

  if (response.status === 204) {
    return null
  }

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error('Server did not respond properly, try again')
  }

  if (!response.ok) {
    throw new Error(data.message)
  }

  return data
}

export default apiRequest
