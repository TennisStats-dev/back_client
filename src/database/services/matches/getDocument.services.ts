import logger from '@config/logger'
import Match from '@database/models/match.model'
import PreMatch from '@database/models/preMatch.model'
import type { Document } from 'mongoose'
import type { IMatch, IPreMatch } from 'types/databaseTypes'
import Tournament from '@database/models/tournament.model'
import Court from '@database/models/court.model'
import { Player } from '@database/models/player.model'
import type { IDateRange } from 'types/types'

export const dummyValue = {
	Tournament,
	Court,
	Player,
}

const getAllPreMatches = async (): Promise<Array<IPreMatch & Document> | null> => {
	try {
		const existingPopulatedMatch = await PreMatch.find()
			.populate('tournament')
			.populate('court')
			.populate('home')
			.populate('away')

		return existingPopulatedMatch
	} catch (err) {
		console.log(err)
		logger.error('Error getting all pre matches')
		throw new Error('Error getting all pre matches')
	}
}

const getEndedMatch = async (api_id: number): Promise<(IMatch & Document) | null> => {
	try {
		const existingPopulatedMatch = await Match.findOne({
			api_id,
		})
			.populate('tournament')
			.populate('court')
			.populate('home')
			.populate('away')

		return existingPopulatedMatch
	} catch (err) {
		console.log(err)
		logger.error('Error getting an ended match')
		throw new Error('Error getting an ended match')
	}
}

const getAllPlayerEndedMatches = async (api_id: number): Promise<Array<IPreMatch & Document> | null> => {
	try {
		const playerId = await Player.findOne({ api_id }).select({})
		const existingPopulatedMatch = await Match.find({ $or: [{ home: playerId }, { away: playerId }] })
			.populate('tournament')
			.populate('court')
			.populate('home')
			.populate('away')

		return existingPopulatedMatch
	} catch (err) {
		console.log(err)
		logger.error('Error getting all player ended matches')
		throw new Error('Error getting all player ended matches')
	}
}

const getDayEndedMatches = async (dateRange: IDateRange): Promise<Array<IMatch & Document> | null> => {
	try {
		console.log(dateRange)
		const endedMatches = await Match.find({
			est_time: { $gt: dateRange.from, $lt: dateRange.to },
		})
			.populate('tournament')
			.populate('court')
			.populate('home')
			.populate('away')

		return endedMatches
	} catch (err) {
		console.log(err)
		logger.error('Error getting all ended matches')
		throw new Error('Error getting all ended matches')
	}
}

const getPlayerEndedMatches = async (
	playerApiId: number,
	dateRange: IDateRange,
): Promise<Array<IMatch & Document> | null> => {
	try {
		const playerId = await Player.findOne({ api_id: playerApiId }).select({})

		const endedMatches = await Match.find({
			$and: [
				{
					$or: [
						{
							home: playerId,
						},
						{
							away: playerId,
						},
					],
				},
				{
					est_time: { $gt: dateRange.from, $lt: dateRange.to },
				},
			],
		})
			.populate('tournament')
			.populate('court')
			.populate('home')
			.populate('away')

		return endedMatches
	} catch (err) {
		console.log(err)
		logger.error('Error getting all ended matches')
		throw new Error('Error getting all ended matches')
	}
}

const GET = {
	getAllPreMatches,
	getEndedMatch,
	getDayEndedMatches,
	getAllPlayerEndedMatches,
	getPlayerEndedMatches,
}

export default GET
