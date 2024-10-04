import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message : 'API get list board' })
  })
  .post(authMiddleware.isAuthorzied, boardValidation.createNew, boardController.createNew)

Router.route('/:id')
  .get(authMiddleware.isAuthorzied, boardController.getDetails)
  .put(authMiddleware.isAuthorzied, boardValidation.update, boardController.update) // Update board

// API khi di chuyển card sang một column khác
Router.route('/supports/moving_card')
  .put(authMiddleware.isAuthorzied, boardValidation.moveCardtoDifferentColumn, boardController.moveCardtoDifferentColumn)
export const boardRoute = Router