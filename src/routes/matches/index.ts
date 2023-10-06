import { getTodaySchedule } from "@controllers/matchControllers"
import express from "express"

export const router = express.Router()

router.get('/todaySchedule', getTodaySchedule)

