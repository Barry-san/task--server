export type Task = {
  id: number;
  asignee: User;
  priority: "high" | "medium" | "low";
  description: string;
  isDone: boolean;
};
