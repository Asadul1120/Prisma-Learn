import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { status } from "http-status";
import { createPostServiceDB, getPostsServiceDB } from "./post.service";

const createPostControllerDB = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const userId = req.user?.id;

    const createdPost = await createPostServiceDB(payload, userId);

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Post created successfully",
      data: createdPost,
    });
  },
);

const getAllPostsControllerDB = catchAsync(
  async (req: Request, res: Response) => {
    const posts = await getPostsServiceDB();
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Posts fetched successfully",
      data: posts,
    });
  },
);

export { createPostControllerDB, getAllPostsControllerDB };
