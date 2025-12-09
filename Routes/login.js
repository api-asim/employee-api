import express from "express";
import { generateResetToken, login , simpleResetPassword, verify} from "../control/authController.js";
import authMiddelware  from "../Middelware/authMiddelware.js"

const router = express.Router();

router.post('/api/login', login);
router.get('/api/verify', authMiddelware , verify);
router.post('/api/generate-reset-token', generateResetToken); 
router.patch('/api/reset-password-simple/:token', simpleResetPassword);

export default router;