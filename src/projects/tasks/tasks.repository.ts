import { StatusCodes } from "http-status-codes";
import prisma from "../../db";
import { AppError } from "../../err";
import { Task } from "../../types/tasks";

async function updateTask(taskId: number, taskFields: Partial<Task>) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
    },
  });

  if (!task)
    throw new AppError(
      "the task you are trying to access does not exist",
      StatusCodes.NOT_FOUND
    );

  return await prisma.task.update({
    where: { id: taskId },
    data: taskFields,
  });
}

async function deleteTask(id: number) {
  return await prisma.task.delete({
    where: {
      id,
    },
  });
}
async function getTask(id: number) {
  return await prisma.task.findFirst({ where: { id } });
}
export default {
  getTask,
  updateTask,
  deleteTask,
};
