import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "../../generated/prisma/enums";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { prisma } from "../lib/prisma";

const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new Error(
        "You are not logged in. Please log in to access this resource.",
      );
    }

    const verifiedToken = jwtUtils.verifyToken(
      token,
      config.jwt_access_secret!,
    );

    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }

    const { id, name, email, role } = verifiedToken.data as JwtPayload;

    if (!requiredRoles.includes(role)) {
      throw new Error("You are not authorized to access this resource.");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: id,
        name: name,
        email: email,
        role: role,
      },
    });

    if (!user) {
      throw new Error("User not found. Please log in again.");
    }

    req.user = {
      email: user.email,
      name: user.name,
      id: user.id,
      role: user.role,
    };

    next();
  });
};

export default auth;
