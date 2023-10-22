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

		const [upcomingMatches, endedMatches] = await Promise.all([
			config.database.services.getters.getAllPreMatches(),
			config.database.services.getters.getDayEndedMatches(dateRange),
		])

		const schedule: Array<IMatch | IPreMatch> = []

		if (upcomingMatches !== null) {
			console.log('NOT STARTED: ', upcomingMatches.filter((match) => match.status === 0).length)
			console.log('IN PLAY: ', upcomingMatches.filter((match) => match.status === 1).length)
			console.log('TO BE FIXED: ', upcomingMatches.filter((match) => match.status === 2).length)
			console.log(
				'OTHER: ',
				upcomingMatches.filter((match) => match.status !== 0 && match.status !== 1 && match.status !== 2).length,
			)
			console.log('TOTAL: ', upcomingMatches.length)
			schedule.push(...upcomingMatches)
		}

		if (endedMatches !== null) {
			schedule.push(...endedMatches)
		}

		if (schedule.length === 0) {
			res.status(200).send({ message: 'Not matches for that day' })
		}

		res.status(200).send({ result: schedule })
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

		res.status(200).send({ result: endedMatches })
	} catch (error) {
		logger.error(`Error while trying to get today's schedule`)
		res.status(400).send(error)
	}
}

export const getAllPlayerEndedMatches = async (
	req: Request<unknown, unknown, unknown, { playerId: string }>,
	res: Response,
): Promise<void> => {
	try {
		const playerId = req.query.playerId

		const endedMatches = await config.database.services.getters.getAllPlayerEndedMatches(playerId)

		if (endedMatches === null) {
			res.status(200).send({ message: 'Not matches found' })
		}

		console.log('PARTIDOS: ', endedMatches?.length)

		res.status(200).send({ result: endedMatches })
	} catch (error) {
		logger.error(`Error while trying to get today's schedule`)
		res.status(400).send(error)
	}
}
