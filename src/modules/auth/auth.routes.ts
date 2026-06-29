import { Router } from "express";
import { loginController, refreshTokenController } from "./auth.controller";

const router = Router();

router.post("/login", loginController);
router.post("/refresh-token", refreshTokenController);

export default router;
