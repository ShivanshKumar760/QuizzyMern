import { Router } from "express";
import { loginUser,registerUser } from "../controllers/auth.controller.js";

const router=Router();

router.post('/api/auth/login', loginUser);
  
router.post('/api/auth/register', registerUser);


export default router;