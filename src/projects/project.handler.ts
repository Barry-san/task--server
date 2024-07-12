import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { validator } from "../middlewares/validator";
import { projectSchema } from "../schema";
import { StatusCodes } from "http-status-codes";
import projectServices from "./project.services";

export const projectRoute = Router();
projectRoute.use(requireAuth);

projectRoute.get("/", async (req, res) => {
  const { id } = res.locals;
  const projects = await projectServices.getUserProjects(id);
  res.json({ isSuccess: true, projects });
});

projectRoute.post("/", validator(projectSchema), async (req, res) => {
  const user = res.locals;
  const { title, description } = req.body;
  const response = await projectServices.createProject(
    title,
    description,
    user.id
  );
  return res.status(StatusCodes.CREATED).json({
    isSuccess: true,
    message: "New project created successfully",
    project: response,
  });
});

projectRoute.get("/:id", async (req, res, next) => {
  const user = res.locals;
  try {
    const project = await projectServices.getProject(req.params.id, user.id);
    return res.json({ isSuccess: true, project });
  } catch (error) {
    next(error);
  }
});

projectRoute.delete("/:id", async (req, res, next) => {
  const user = res.locals;
  try {
    await projectServices.deleteProject(req.params.id, user.id);
    res
      .status(StatusCodes.OK)
      .json({ isSuccess: true, message: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
});
