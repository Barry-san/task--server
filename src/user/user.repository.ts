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
    throw new AppError("email already in use", StatusCodes.CONFLICT);
  }
};

const getUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      createdAt: true,
      username: true,
      email: true,
      isVerified: true,
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

const updateUser = async (
  uid: string,
  userFields: Partial<{
    username: string;
    password: string;
    email: string;
    isVerified: boolean;
  }>
) => {
  const user = await prisma.user.update({
    where: { id: uid },
    data: userFields,
    select: {
      id: true,
      isVerified: true,
      username: true,
      email: true,
    },
  });
  return user;
};

export default {
  insertUser,
  getUsers,
  deleteUser,
  getUser,
  getUserByEmail,
  updateUser,
};
