import 'module-alias/register'
import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import config from './config'
import logger from '@config/logger'
import { generalRouter } from './routes'


export const app = express()
app.use(express.json())

app.use(cors())

config.database.connection.connectDB()

app.use(generalRouter)

app.get('/ping', (_, res) => {
	console.log('someone pinged here ' + new Date().toLocaleDateString())
	res.send('pong')
})

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
const port = config.server.port || '0.0.0.0:$PORT'

app.listen(port, () => {
	logger.info(`Server running on port ${port}`)
})
