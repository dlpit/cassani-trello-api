import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from '~/routes/v1/boardRoute'
import { columnRoute } from '~/routes/v1/columnRoute'
import { cardRoute } from '~/routes/v1/cardRoute'
import { userRoute } from '~/routes/v1/userRoute'
const Router = express.Router()

// Hello World API
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message : 'Hello World!' })
})

// Board API
Router.use('/boards', boardRoute)

// Column API
Router.use('/columns', columnRoute)

// Card API
Router.use('/cards', cardRoute)

// User API
Router.use('/users', userRoute)

export const APIs_V1 = Router