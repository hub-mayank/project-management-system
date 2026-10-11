function ProjectCard({ project, isAdmin, onEdit, onStatusChange, onDelete, saving }) {
  return (
    <article className="card project-card">
      <h3>{project.name}</h3>
      <p className="project-description">{project.description || 'No description'}</p>
      <p>Status: {project.status}</p>
      <p>Priority: {project.priority}</p>
      <p>Deadline: {project.deadline ? project.deadline.slice(0, 10) : 'No deadline'}</p>
      <p>Assigned members:</p>
      {project.assignedMembers.length === 0 ? (
        <p className="status">No members assigned</p>
      ) : (
        <ul>
          {project.assignedMembers.map((member) => (
            <li key={member._id}>{member.name}</li>
          ))}
        </ul>
      )}
      {isAdmin ? (
        <div className="project-actions">
          <button type="button" onClick={() => onEdit(project)} disabled={saving}>Edit</button>
          <button type="button" className="danger" onClick={() => onDelete(project)} disabled={saving}>Delete</button>
        </div>
      ) : (
        <div>
          <label htmlFor={`status-${project._id}`}>Change status</label>
          <select
            id={`status-${project._id}`}
            value={project.status}
            onChange={(e) => onStatusChange(project._id, e.target.value)}
            disabled={saving}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}
    </article>
  )
}

export default ProjectCard
