import React, { useEffect, useState } from 'react'

function Home() {
  const [status, setStatus] = useState('checking server...')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setStatus(data.message))
      .catch(() => setStatus('server is not reachable'))
  }, [])

  return (
    <div className="container">
      <h1>Project Management System</h1>
      <p className="status">{status}</p>
    </div>
  )
}

export default Home
