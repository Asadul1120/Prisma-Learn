import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import jwt, { SignOptions } from "jsonwebtoken";
import config from "../../config";

interface LoginInput {
  email: string;
  password: string;
}

const loginServiceDB = async (payload: LoginInput) => {
  const { email, password } = payload;
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const PlaylodJwt = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(PlaylodJwt, config.jwt_access_secret!, {
    expiresIn: config.jwt_access_expiration,
  } as SignOptions);
  const refreshToken = jwt.sign(PlaylodJwt, config.jwt_refresh_secret!, {
    expiresIn: config.jwt_refresh_expiration,
  } as SignOptions);

  return { accessToken, refreshToken };
};

export { loginServiceDB };
