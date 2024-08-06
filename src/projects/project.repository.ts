import prisma from "../db";

async function getUserProjects(id: string) {
  const projects = await prisma.project.findMany({
    where: {
      userId: id,
    },
    select: {
      id: true,
      tasks: {
        take: 10,
      },
      name: true,
      description: true,
      collaborators: {
        select: {
          id: true,
          email: true,
          username: true,
          isVerified: true,
        },
      },
    },
    take: 10,
  });
  return projects;
}

async function createProject(title: string, description: string, uid: string) {
  const projects = await prisma.project.create({
    data: {
      userId: uid,
      name: title,
      description: description,
    },
  });
  return projects;
}

async function getProjectById(id: string) {
  const project = await prisma.project.findFirst({
    where: {
      id,
    },
  });
  return project;
}

async function deleteProject(pID: string, uID: string) {
  const response = await prisma.project.delete({
    where: {
      id: pID,
      userId: uID,
    },
  });

  return response;
}

async function addTask(
  pID: string,
  task: { title: string; description?: string; isDone: boolean }
) {
  const result = await prisma.task.create({
    data: {
      isDone: task.isDone,
      projectId: pID,
      description: task.description,
      Title: task.title,
      priority: "low",
    },
  });
  return result;
}

async function addCollaborator(Pid: string, userId: string) {
  const result = await prisma.project.update({
    where: { id: Pid },
    data: {
      collaborators: {
        connect: { id: userId },
      },
    },
  });
  return result;
}

async function getCollaborators(projectId: string) {
  const collaborators = await prisma.project.findFirst({
    where: {
      id: projectId,
    },
    select: {
      collaborators: {
        select: {
          id: true,
          email: true,
          username: true,
          isVerified: true,
        },
      },
    },
  });

  return collaborators;
}

async function removeCollaborator(projectId: string, collaboratorId: string) {
  return await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      collaborators: {
        disconnect: {
          id: collaboratorId,
        },
      },
    },
  });
}

export default {
  addTask,
  createProject,
  getUserProjects,
  getProjectById,
  getCollaborators,
  deleteProject,
  removeCollaborator,
  addCollaborator,
};
