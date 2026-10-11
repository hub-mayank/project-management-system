function ProjectCard({ project }) {
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
    </article>
  )
}

export default ProjectCard
