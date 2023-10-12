export interface IDateRange {
	from: Date
	to: Date
}

export interface IReqPlayerMatches {
	dateRange: IDateRange,
	playerApiId: number
}
