import Navbar from '../components/Navbar'

import { useEffect, useState } from 'react'
import ProjectCard from '../components/ProjectCard'
import ProjectForm from '../components/ProjectForm'
import apiRequest from '../services/api'

function Projects() {
  const [projectList, setProjectList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userList, setUserList] = useState([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState('')
  const [saving, setSaving] = useState(false)
  const [projectToEdit, setProjectToEdit] = useState(null)
  let user = null
  try {
    user = JSON.parse(localStorage.getItem('user'))
  } catch {
    // Navbar handles invalid stored user data.
  }
  const isAdmin = user && user.role === 'admin'

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

  async function getUsers() {
    try {
      const data = await apiRequest('/users')
      setUserList(data)
      setUsersError('')
    } catch (err) {
      setUsersError(err.message)
    } finally {
      setUsersLoading(false)
    }
  }

  useEffect(() => {
    async function loadData() {
      await getProjects()
      if (isAdmin) {
        await getUsers()
      }
    }
    loadData()
  }, [isAdmin])

  async function saveProject(formData) {
    setSaving(true)
    setError('')

    try {
      if (projectToEdit) {
        await apiRequest(`/projects/${projectToEdit._id}`, 'PUT', formData)
      } else {
        await apiRequest('/projects', 'POST', formData)
      }
      setProjectToEdit(null)
      await getProjects()
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setSaving(false)
    }
  }

  function editProject(project) {
    setError('')
    setProjectToEdit(project)
  }

  async function updateStatus(projectId, status) {
    setSaving(true)
    setError('')

    try {
      await apiRequest(`/projects/${projectId}`, 'PUT', { status })
      await getProjects()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function deleteProject(project) {
    if (!window.confirm(`Delete "${project.name}"?`)) {
      return
    }

    setSaving(true)
    setError('')

    try {
      await apiRequest(`/projects/${project._id}`, 'DELETE')
      if (projectToEdit && projectToEdit._id === project._id) {
        setProjectToEdit(null)
      }
      await getProjects()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container">
      <Navbar />
      <h2>Projects</h2>
      {loading && <p className="status">Loading projects...</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {isAdmin && (
        <>
          {usersLoading && <p className="status">Loading members...</p>}
          {usersError && <p className="error" role="alert">{usersError}</p>}
          {!usersLoading && !usersError && (
            <ProjectForm
              key={projectToEdit ? projectToEdit._id : 'new'}
              project={projectToEdit}
              userList={userList}
              onSave={saveProject}
              onCancel={() => setProjectToEdit(null)}
              saving={saving}
            />
          )}
        </>
      )}
      {!loading && !error && projectList.length === 0 && (
        <p className="status">no projects yet</p>
      )}
      <div className="project-list">
        {projectList.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            isAdmin={isAdmin}
            onEdit={editProject}
            onStatusChange={updateStatus}
            onDelete={deleteProject}
            saving={saving}
          />
        ))}
      </div>
    </div>
  )
}

export default Projects
