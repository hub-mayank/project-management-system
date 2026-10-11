import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  let user = null
  let invalidUser = false

  try {
    user = JSON.parse(localStorage.getItem('user'))
  } catch {
    invalidUser = true
  }

  useEffect(() => {
    if (invalidUser) {
      localStorage.clear()
      navigate('/login', { replace: true })
    }
  }, [invalidUser, navigate])

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  return (
    <nav className="card">
      <h1>Project Management System</h1>
      {user && <p>{user.name} ({user.role})</p>}
      <button type="button" onClick={handleLogout}>Logout</button>
    </nav>
  )
}

export default Navbar
