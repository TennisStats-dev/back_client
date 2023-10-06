import config from '@config/index'
import logger from '@config/logger'

import type { Request, Response } from 'express'
import type { IMatch, IPreMatch } from 'types/databaseTypes'

export const getTodaySchedule = async (req: Request, res: Response): Promise<void> => {
	try {
		console.log('------------------', req)
		const dateRange = req.query.dateRange

		console.log(dateRange)

		const upcomingMatches = await config.database.services.getters.getAllPreMatches()

		const endedMatches = await config.database.services.getters.getDateEndedMatches(dateRange)

		const result: Array<IMatch | IPreMatch> = []

		if (upcomingMatches !== null) {
			console.log(upcomingMatches.length)
			result.push(...upcomingMatches)
		}

		if (endedMatches !== null) {
			console.log(endedMatches.length)
			result.push(...endedMatches)
		}

		if (result.length === 0) {
			res.status(200).send({ message: 'Not matches for that day' })
		}

		res.status(200).send({ result })
	} catch (error) {
		logger.error(`Error while trying to get today's schedule`)
		res.status(400).send(error)
	}
}
