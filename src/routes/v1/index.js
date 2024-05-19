import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoutes } from '~/routes/v1/boardRoutes'
const Router = express.Router()

// Hello World API
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message : 'Hello World!' })
})

// Board API
Router.use('/board', boardRoutes)

export const APIs_V1 = Router