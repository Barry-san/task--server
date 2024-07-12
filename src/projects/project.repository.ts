import prisma from "../db";

async function getUserProjects(id: string) {
  const projects = await prisma.project.findMany({
    where: {
      userId: id,
    },
    select: {
      id: true,
      tasks: true,
      name: true,
      description: true,
    },
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

export default {
  getUserProjects,
  createProject,
  getProjectById,
  deleteProject,
};
