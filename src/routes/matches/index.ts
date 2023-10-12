import { getPlayerEndedMatchesFromDate, getSchedule } from '@controllers/matchControllers'
import express from 'express'

export const router = express.Router()

router.get('/today-schedule', getSchedule)

router.get('/player-stats', getPlayerEndedMatchesFromDate)
