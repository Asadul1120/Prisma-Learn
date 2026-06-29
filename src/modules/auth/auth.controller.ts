import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { loginServiceDB, refreshTokenServiceDB } from "./auth.service";

const loginController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const { accessToken, refreshToken } = await loginServiceDB(payload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Login user successfully",
      data: { accessToken, refreshToken },
    });
  },
);

const refreshTokenController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const { accessToken } = await refreshTokenServiceDB(refreshToken);
    
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Login user successfully",
      data: { accessToken },
    });
  },
);

export { loginController, refreshTokenController };
