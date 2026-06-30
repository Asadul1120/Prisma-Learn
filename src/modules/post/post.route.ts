import { Router } from "express";
import {
  createPostControllerDB,
  getAllPostsControllerDB,
} from "./post.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  createPostControllerDB,
);

router.get("/", getAllPostsControllerDB);

export default router;
