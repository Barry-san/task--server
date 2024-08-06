import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { validator } from "../middlewares/validator";
import { projectSchema, taskSchema } from "../schema";
import { StatusCodes } from "http-status-codes";
import projectServices from "./project.services";
import { z } from "zod";
import projectRepository from "./project.repository";

export const projectRoute = Router();

projectRoute.get("/collaborate/:token", async (req, res, next) => {
  try {
    const token = req.params.token;
    const response = await projectServices.addCollaborator(token);
    return res.json({
      isSuccess: true,
      response,
    });
  } catch (error) {
    next(error);
  }
});

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

projectRoute.post("/:id", validator(taskSchema), async (req, res, next) => {
  const { title, description, isDone } = req.body;
  const user = res.locals;
  try {
    const result = await projectServices.addTask(user.id, req.params.id, {
      title,
      description,
      isDone,
    });
    res.status(StatusCodes.CREATED).json({
      isSuccess: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

projectRoute.get("/:id/collaborators", async (req, res, next) => {
  try {
    const collaborators = await projectRepository.getCollaborators(
      req.params.id
    );

    res.json({ isSuccess: true, collaborators });
  } catch (error) {
    next(error);
  }
});

projectRoute.post(
  "/:id/collaborators",
  validator(z.object({ email: z.string().email() })),
  async (req, res, next) => {
    const { email } = req.body;
    const user = res.locals;
    try {
      const response = await projectServices.inviteCollaborator(
        req.params.id,
        email,
        user.id
      );
      res.json({ isSuccess: true, data: response });
    } catch (error) {
      next(error);
    }
  }
);

projectRoute.delete("/:id/collaborators", async (req, res, next) => {
  const user = res.locals;
  const { id } = req.body;
  try {
    const project = await projectServices.removeCollaborator(
      req.params.id,
      id,
      user.id
    );
    res.json({ isSuccess: true, project });
  } catch (err) {
    next(err);
  }
});

// projectRoute.put("/:id/:task", validator(taskSchema), async (req, res) => {});
