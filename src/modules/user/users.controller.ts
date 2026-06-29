import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { userCreateServiceDB, GetUserProfileServiceDB, updateUserProfileSeriviceDB } from "./users.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";


// const userCreate = async (req: Request, res: Response) => {
//   try {
//     const payload = req.body;
//     const user = await userCreateServiceDB(payload);

//     res.status(status.CREATED).json({
//       success: true,
//       statusCode: status.CREATED,
//       message: "user register successfully",
//       data: user,
//     });
//   } catch (error) {
//     res.status(status.BAD_REQUEST).json({
//       success: false,
//       statusCode: status.BAD_REQUEST,
//       message:(error as Error).message,
//     })
//   }

// };

const userCreate = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = await userCreateServiceDB(payload);
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "user register successfully",
    data: user,
  });
});

const userMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const profile = await GetUserProfileServiceDB(userId!);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "user profile successfully",
    data: profile,
  });
});


const userUpdate = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const payload = req.body;

  const user = await updateUserProfileSeriviceDB(userId!, payload);
  
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "user profile successfully",
    data: user,
  });
});

export default {
  userCreate,
  userMe,
  userUpdate
};
