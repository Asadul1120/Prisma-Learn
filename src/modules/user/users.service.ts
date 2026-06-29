import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  profilePhoto: string;
}

const userCreateServiceDB = async (payload: CreateUserInput) => {
  const { name, email, password, profilePhoto } = payload;

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const CreateUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
    },
  });

  await prisma.profile.create({
    data: {
      userId: CreateUser.id,
      profilePhoto,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: CreateUser.id,
      email: email,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return user;
};

const GetUserProfileServiceDB = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });
  return user;
};

const updateUserProfileSeriviceDB = async (id: string, payload: any) => {
  const { name, email, profilePhoto, bio } = payload;

  const user = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      name: name,
      email: email,
      profile: {
        update: {
          profilePhoto: profilePhoto,
          bio: bio,
        },
      },
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return user;
};

export {
  userCreateServiceDB,
  GetUserProfileServiceDB,
  updateUserProfileSeriviceDB,
};
