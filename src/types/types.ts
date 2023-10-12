export interface IDateRange {
	from: Date
	to: Date
}

export interface IScheduleDateRange {
	dateRange: {
		from: Date
		to: Date
	}
}

export interface IReqPlayerMatches {
	dateRange: IDateRange
	playerApiId: number
}
