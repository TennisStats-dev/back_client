import config from '@config/index'
import logger from '@config/logger'

import type { Request, Response } from 'express'
import type { IMatch, IPreMatch } from 'types/databaseTypes'
import type { IReqPlayerMatches, IScheduleDateRange } from 'types/types'

export const getSchedule = async (
	req: Request<unknown, unknown, unknown, IScheduleDateRange>,
	res: Response,
): Promise<void> => {
	try {
		const dateRange = req.query.dateRange

		const upcomingMatches = await config.database.services.getters.getAllPreMatches()

		const endedMatches = await config.database.services.getters.getDayEndedMatches(dateRange)

		const result: Array<IMatch | IPreMatch> = []

		if (upcomingMatches !== null) {
			console.log('IN PLAY: ', upcomingMatches.filter(match => match.status === 2).length)
			console.log('NOT STARTED: ', upcomingMatches.filter(match => match.status === 0).length)
			console.log('OTHER: ', upcomingMatches.filter(match => match.status !== 0 && match.status !== 2).length)
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

export const getPlayerEndedMatchesFromDate = async (
	req: Request<unknown, unknown, unknown, IReqPlayerMatches>,
	res: Response,
): Promise<void> => {
	try {
		const dateRange = req.query.dateRange
		const playerApiId = req.query.playerApiId

		const endedMatches = await config.database.services.getters.getPlayerEndedMatches(playerApiId, dateRange)

		if (endedMatches === null) {
			res.status(200).send({ message: 'Not matches found' })
		}

		console.log('PARTIDOOOOOOOOOOOOS \n', endedMatches?.length)

		res.status(200).send({ endedMatches })
	} catch (error) {
		logger.error(`Error while trying to get today's schedule`)
		res.status(400).send(error)
	}
}
