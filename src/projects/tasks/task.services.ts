import { Task } from "../../types/tasks";
import tasksRepository from "./tasks.repository";

async function updateTask(taskId: number, taskFields: Partial<Task>) {
  const task = await tasksRepository.updateTask(taskId, taskFields);
  return task;
}

async function deleteTask(taskId: number) {
  tasksRepository.deleteTask(taskId);
}
export default { updateTask, deleteTask };
