import Navbar from '../components/Navbar'

import { useEffect, useState } from 'react'
import ProjectCard from '../components/ProjectCard'
import apiRequest from '../services/api'

function Projects() {
  const [projectList, setProjectList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function getProjects() {
    try {
      const data = await apiRequest('/projects')
      setProjectList(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function loadData() {
      await getProjects()
    }
    loadData()
  }, [])

  return (
    <div className="container">
      <Navbar />
      <h2>Projects</h2>
      {loading && <p className="status">Loading projects...</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {!loading && !error && projectList.length === 0 && (
        <p className="status">no projects yet</p>
      )}
      <div className="project-list">
        {projectList.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  )
}

export default Projects
