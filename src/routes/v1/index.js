import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from '~/routes/v1/boardRoute'
const Router = express.Router()

// Hello World API
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message : 'Hello World!' })
})

// Board API
Router.use('/boards', boardRoute)

export const APIs_V1 = Router