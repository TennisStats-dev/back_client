
import { API } from '@API/index'
import MONGODB from '@database/index'


const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME ?? 'localhost'
const PORT = process.env.PORT ?? 3000

const FRONT_URL = process.env.FRONT_URL

const SERVER = {
	hostname: SERVER_HOSTNAME,
	port: PORT,
}

const config = {
	server: SERVER,
	database: MONGODB,
	api: API,
	frontURL: FRONT_URL 
}

export default config
