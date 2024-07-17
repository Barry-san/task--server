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
      collaborators: true,
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

async function addCollaborator(Pid: string, user: { id: string }) {
  console.log(user.id);
  const result = await prisma.project.update({
    where: { id: Pid },
    data: {
      collaborators: {
        connect: { id: user.id },
      },
    },
  });
  console.log(result);
  return result;
}

export default {
  getUserProjects,
  createProject,
  getProjectById,
  deleteProject,
  addTask,
  addCollaborator,
};
