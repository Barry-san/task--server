import { StatusCodes } from "http-status-codes";
import prisma from "../db";
import { AppError } from "../err";

const insertUser = async (
  username: string,
  password: string,
  email: string
) => {
  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password,
      },
    });
    return user;
  } catch (error) {
    throw new AppError("email already in use", StatusCodes.BAD_REQUEST);
  }
};

const getUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      createdAt: true,
      username: true,
      email: true,
    },
  });
  return users;
};

const getUser = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      password: false,
    },
  });
  return user;
};

const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  return user;
};

const deleteUser = async (id: string) => {
  await prisma.user.delete({
    where: {
      id,
    },
  });
};

export default { insertUser, getUsers, deleteUser, getUser, getUserByEmail };
