import express from "express"
import { logout, signup ,signin} from "../controllers/auth.controller.js"
import { verifyUser } from "../utils/verifyUser.js"
const router = express.Router()


router.post('/signup', signup)
router.post('/signin',verifyUser,signin)
router.post('/logout',logout)

export default router