import express from "express";
import { login , verify} from "../control/authController.js";
import authMiddelware  from "../Middelware/authMiddelware.js"

const router = express.Router();

router.post('/api/login', login);
router.get('/api/verify', authMiddelware , verify);

export default router;