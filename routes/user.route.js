import express from "express"
import { updateUser } from "../controllers/user.controllers.js"

const router = express.Router()

router.put('/updateuser/:userId',updateUser)

export default router