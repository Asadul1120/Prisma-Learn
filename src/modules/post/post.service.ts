import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PostStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

export interface ICreatePostPayload {
  title: string;
  content: string;
  thumbnail?: string;
  isFeatured?: boolean;
  status?: PostStatus;
  tags: string[];
}

const createPostServiceDB = (payload: ICreatePostPayload, userId: string) => {
  const result = prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};

const getPostsServiceDB = () => {
  const result = prisma.post.findMany({
    include: {
      author: {
        omit: {
          password: true,
        },
      },
    },
  });
  return result;
};

export { createPostServiceDB, getPostsServiceDB };
