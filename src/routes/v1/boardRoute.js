import express from 'express'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .get(authMiddleware.isAuthorzied, boardController.getBoards) // Get all boards
  .post(authMiddleware.isAuthorzied, boardValidation.createNew, boardController.createNew)

Router.route('/:id')
  .get(authMiddleware.isAuthorzied, boardController.getDetails)
  .put(authMiddleware.isAuthorzied, boardValidation.update, boardController.update) // Update board

// API để toggle trạng thái starred của board
Router.route('/:id/toggle-star')
  .put(authMiddleware.isAuthorzied, boardController.toggleStar)

// API khi di chuyển card sang một column khác
Router.route('/supports/moving_card')
  .put(authMiddleware.isAuthorzied, boardValidation.moveCardtoDifferentColumn, boardController.moveCardtoDifferentColumn)
export const boardRoute = Router