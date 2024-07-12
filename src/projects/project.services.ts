import { StatusCodes } from "http-status-codes";
import { AppError } from "../err";
import projectRepository from "./project.repository";

function addTask(
  projectId: string,
  task: { title: string; description: string; isDone: string }
) {
  return;
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

export default {
  addTask,
  deleteProject,
  createProject,
  getUserProjects,
  getProject,
};
