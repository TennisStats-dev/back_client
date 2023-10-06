import logger from '@config/logger'
import Match from '@database/models/match.model'
import PreMatch from '@database/models/preMatch.model'
import type { Document } from 'mongoose'
import type { IMatch, IPreMatch } from 'types/databaseTypes'
import Tournament from '@database/models/tournament.model'
import Court from '@database/models/court.model'
import { Player } from '@database/models/player.model'

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

const getAllPlayerEndedMatches = async (id: string): Promise<Array<IPreMatch & Document> | null> => {
	try {
		const existingPopulatedMatch = await Match.find({ $or: [{ home: id }, { away: id }] })

		return existingPopulatedMatch
	} catch (err) {
		console.log(err)
		logger.error('Error getting all player ended matches')
		throw new Error('Error getting all player ended matches')
	}
}

const getDateEndedMatches = async (dateRange: any): Promise<Array<IMatch & Document> | null> => {
	try {
		if (typeof dateRange.from === 'string' && typeof dateRange.to === 'string') {
			const existingPopulatedMatch = await Match.find({
				est_time: { $gt: dateRange.from, $lt: dateRange.to },
			})
			.populate('tournament')
			.populate('court')
			.populate('home')
			.populate('away')
			
			return existingPopulatedMatch
		} else {
			return null
		}
	} catch (err) {
		console.log(err)
		logger.error('Error getting all ended matches')
		throw new Error('Error getting all ended matches')
	}
}

const GET = {
	getAllPreMatches,
	getEndedMatch,
	getDateEndedMatches,
	getAllPlayerEndedMatches,
}

export default GET
