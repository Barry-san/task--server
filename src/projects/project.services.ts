import { StatusCodes } from "http-status-codes";
import { AppError } from "../err";
import projectRepository from "./project.repository";
import userRepository from "../user/user.repository";

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

async function addCollaborator(
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

  return await projectRepository.addCollaborator(projectId, user);
}

export default {
  addTask,
  deleteProject,
  createProject,
  getUserProjects,
  getProject,
  addCollaborator,
};
