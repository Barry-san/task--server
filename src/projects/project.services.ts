import { StatusCodes } from "http-status-codes";
import { AppError } from "../err";
import projectRepository from "./project.repository";
import userRepository from "../user/user.repository";
import taskRepository from "./tasks/tasks.repository";
import taskServices from "./tasks/task.services";
import { sign, verify } from "jsonwebtoken";
import { env_vars } from "../ENV";
import { transporter } from "../mail";

async function addTask(
  userId: string,
  projectId: string,
  task: { title: string; description?: string; isDone: boolean }
) {
  const project = await projectRepository.getProjectById(projectId);
  if (!project)
    throw new AppError(
      "The project you're trying to modify does not exist. ",
      StatusCodes.NOT_FOUND
    );

  if (project.userId !== userId)
    throw new AppError("insufficient permissions", StatusCodes.FORBIDDEN);

  const result = await projectRepository.addTask(projectId, task);
  return result;
}

async function createProject(title: string, description: string, uid: string) {
  console.group(uid);
  const project = await projectRepository.createProject(
    title,
    description,
    uid
  );
  return project;
}

async function getUserProjects(uid: string) {
  const projects = await projectRepository.getUserProjects(uid);
  return projects;
}

async function getProject(pid: string, uid: string) {
  const project = await projectRepository.getProjectById(pid);
  if (!project) throw new AppError("project not found", StatusCodes.NOT_FOUND);
  if (project.userId !== uid)
    throw new AppError("insufficient permissions", StatusCodes.FORBIDDEN);
  return project;
}

async function deleteProject(pID: string, uID: string) {
  const project = await projectRepository.getProjectById(pID);
  if (!project) throw new AppError("project not found", StatusCodes.NOT_FOUND);
  if (project.userId != uID)
    throw new AppError("inadequate permissions", StatusCodes.FORBIDDEN);
  const response = await projectRepository.deleteProject(pID, uID);
  return response;
}

async function inviteCollaborator(
  projectId: string,
  collaboratorEmail: string,
  uid: string
) {
  const user = await userRepository.getUserByEmail(collaboratorEmail);
  if (!user) throw new AppError("user does not exist", StatusCodes.NOT_FOUND);

  const project = await projectRepository.getProjectById(projectId);
  if (!project)
    throw new AppError("project does not exist", StatusCodes.NOT_FOUND);

  if (project.userId !== uid)
    throw new AppError(
      "only project admins can add collaborators",
      StatusCodes.FORBIDDEN
    );

  const token = sign(
    { projectId: project.id, email: collaboratorEmail },
    env_vars.ACCESS_TOKEN_KEY,
    { expiresIn: "1h" }
  );

  const res = await transporter.sendMail({
    to: collaboratorEmail,
    from: "hello@taskmanager.com",
    subject: `You have been invited to join ${project.name}`,
    html: `<h1>You have been invited to collaborate on the project <i>${project.name}</i> <br/> <p>Click on the link below to begin collaborating!</p> <a href="${env_vars.DOMAIN_URL}/project/collaborate/${token}">Start collaborating</a>`,
  });

  return res;
}

async function getCollaborators(projectId: string) {
  return await projectRepository.getCollaborators(projectId);
}

async function removeCollaborator(
  projectId: string,
  collaboratorId: string,
  uid: string
) {
  const project = await projectRepository.getProjectById(projectId);
  if (!project)
    throw new AppError("project does not exist", StatusCodes.NOT_FOUND);

  if (!(project.userId === uid))
    throw new AppError(
      "You do not have sufficient permissions to perform this operation",
      StatusCodes.FORBIDDEN
    );
  return await projectRepository.removeCollaborator(projectId, collaboratorId);
}

async function deleteTask(taskId: number, uid: string) {
  const task = await taskRepository.getTask(taskId);
  if (!task)
    throw new AppError(
      "the task you're trying to access does not exist.",
      StatusCodes.NOT_FOUND
    );
  const parentProject = await projectRepository.getProjectById(task.projectId);
  if (uid !== parentProject?.userId)
    throw new AppError(
      "You don't have permission to delete this task",
      StatusCodes.FORBIDDEN
    );

  return await taskServices.deleteTask(taskId);
}

async function addCollaborator(token: string) {
  try {
    const { email, projectId } = <{ email: string; projectId: string }>(
      verify(token, env_vars.ACCESS_TOKEN_KEY)
    );
    const user = await userRepository.getUserByEmail(email);

    if (!user)
      throw new AppError(
        `User with the email ${email} does not exist.`,
        StatusCodes.NOT_FOUND
      );

    return projectRepository.addCollaborator(projectId, user.id);
  } catch (error) {
    throw new AppError("invalid or expired invite link", StatusCodes.FORBIDDEN);
  }
}
export default {
  createProject,
  addTask,
  getProject,
  getUserProjects,
  getCollaborators,
  inviteCollaborator,
  addCollaborator,
  removeCollaborator,
  deleteProject,
  deleteTask,
};
