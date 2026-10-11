import { useState } from 'react'

function ProjectForm({ project, userList, onSave, onCancel, saving }) {
  const [name, setName] = useState(project ? project.name : '')
  const [description, setDescription] = useState(project ? project.description || '' : '')
  const [status, setStatus] = useState(project ? project.status : 'pending')
  const [deadline, setDeadline] = useState(project && project.deadline ? project.deadline.slice(0, 10) : '')
  const [priority, setPriority] = useState(project ? project.priority : 'medium')
  const [assignedMembers, setAssignedMembers] = useState(
    project ? project.assignedMembers.map((member) => member._id) : []
  )
  const [error, setError] = useState('')

  function resetForm() {
    setName('')
    setDescription('')
    setStatus('pending')
    setDeadline('')
    setPriority('medium')
    setAssignedMembers([])
  }

  function handleMemberChange(memberId, checked) {
    if (checked) {
      setAssignedMembers([...assignedMembers, memberId])
    } else {
      setAssignedMembers(assignedMembers.filter((id) => id !== memberId))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      const saved = await onSave({
        name,
        description,
        status,
        deadline: deadline ? `${deadline}T00:00:00.000Z` : null,
        priority,
        assignedMembers
      })
      if (saved) {
        resetForm()
      }
    } catch (err) {
      setError(err.message)
    }
  }

  let buttonText = 'Create project'
  if (project) {
    buttonText = 'Save changes'
  }
  if (saving) {
    buttonText = 'Saving...'
  }

  return (
    <form className="card project-form" onSubmit={handleSubmit}>
      <h3>{project ? 'Edit project' : 'Create project'}</h3>
      <fieldset disabled={saving}>
        <label htmlFor="project-name">Name</label>
        <input id="project-name" value={name} onChange={(e) => setName(e.target.value)} required />

        <label htmlFor="project-description">Description</label>
        <textarea id="project-description" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" />

        <label htmlFor="project-status">Status</label>
        <select id="project-status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
        </select>

        <label htmlFor="project-deadline">Deadline</label>
        <input id="project-deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />

        <label htmlFor="project-priority">Priority</label>
        <select id="project-priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <fieldset className="project-members">
          <legend>Assigned members</legend>
          {userList.length === 0 && <p className="status">No users available</p>}
          {userList.map((user) => (
            <label className="project-member" key={user._id}>
              <input
                type="checkbox"
                checked={assignedMembers.includes(user._id)}
                onChange={(e) => handleMemberChange(user._id, e.target.checked)}
              />
              {user.name} ({user.email})
            </label>
          ))}
        </fieldset>

        {error && <p className="error" role="alert">{error}</p>}
        <div className="project-actions">
          <button type="submit">{buttonText}</button>
          {project && <button type="button" onClick={onCancel}>Cancel edit</button>}
        </div>
      </fieldset>
    </form>
  )
}

export default ProjectForm
