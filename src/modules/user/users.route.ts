import { Router } from "express";
import userController from "./users.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";


const router = Router();

router.post("/register", userController.userCreate);
router.get("/me", auth(Role.USER, Role.ADMIN ,Role.AUTHOR), userController.userMe);
router.put("/my-profile", auth(Role.USER, Role.ADMIN ,Role.AUTHOR), userController.userUpdate);

export default router;
